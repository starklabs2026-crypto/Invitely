import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/store/editorStore';
import { writeTempFile, saveImageToGallery } from '@/services/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ShareScreen() {
  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  const template = useEditorStore((s) => s.template);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const previewUri = template?.thumb_url ?? null;

  async function handleShare(platform: string) {
    if (!previewUri) {
      Alert.alert('No card', 'Please complete your design first.');
      return;
    }

    setSharing(true);
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        return;
      }

      const fileUri = await writeTempFile(
        previewUri.startsWith('http') ? '' : previewUri,
        `invitely_card_${Date.now()}`
      );
      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your invitation',
      });
    } catch (err) {
      Alert.alert('Share failed', 'Could not share the card. Please try again.');
    } finally {
      setSharing(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      Alert.alert('Downloaded!', 'Your invitation has been saved to your photo library.');
    } catch {
      Alert.alert('Error', 'Could not save to gallery. Please check permissions.');
    } finally {
      setDownloading(false);
    }
  }

  const SHARE_OPTIONS = [
    { label: 'WhatsApp', icon: 'logo-whatsapp' as const, color: '#25D366' },
    { label: 'Instagram', icon: 'logo-instagram' as const, color: '#E1306C' },
    { label: 'Download', icon: 'download-outline' as const, color: COLORS.ink },
    { label: 'More', icon: 'share-social-outline' as const, color: COLORS.primary },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.previewWrapper}>
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={styles.preview}
              resizeMode="contain"
              defaultSource={require('@/assets/placeholder.png')}
            />
          ) : (
            <View style={[styles.preview, styles.previewPlaceholder]}>
              <Text style={styles.placeholderText}>Your invitation preview</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Share via</Text>
        <View style={styles.shareRow}>
          {SHARE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={styles.shareButton}
              onPress={() =>
                opt.label === 'Download' ? handleDownload() : handleShare(opt.label)
              }
              disabled={sharing || downloading}
            >
              <View style={[styles.shareIconWrap, { backgroundColor: opt.color + '20' }]}>
                {(sharing || downloading) && opt.label === (sharing ? 'WhatsApp' : 'Download') ? (
                  <ActivityIndicator color={opt.color} size="small" />
                ) : (
                  <Ionicons name={opt.icon} size={22} color={opt.color} />
                )}
              </View>
              <Text style={styles.shareLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.copyLink}
          onPress={() => Alert.alert('Coming soon', 'Link sharing will be available soon.')}
        >
          <Ionicons name="link-outline" size={16} color={COLORS.primary} />
          <Text style={styles.copyLinkText}>Copy link</Text>
        </TouchableOpacity>

        <View style={styles.rsvpSection}>
          <Text style={styles.rsvpTitle}>Collect RSVPs</Text>
          <Text style={styles.rsvpSubtitle}>
            Let guests respond directly from the invite link
          </Text>
          <Button
            label="Create RSVP form"
            onPress={() => Alert.alert('Coming soon', 'RSVP forms are coming in the next update.')}
            variant="outline"
            size="md"
            style={styles.rsvpButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { padding: 6 },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.ink,
  },
  scroll: { paddingBottom: 48 },
  previewWrapper: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.bg2,
  },
  preview: {
    width: SCREEN_WIDTH - 80,
    height: (SCREEN_WIDTH - 80) * (7 / 5),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  previewPlaceholder: {
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.ink,
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 16,
  },
  shareRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    justifyContent: 'center',
  },
  shareButton: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  shareIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.ink,
  },
  copyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },
  copyLinkText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  rsvpSection: {
    marginHorizontal: 24,
    marginTop: 28,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg2,
    gap: 6,
    alignItems: 'flex-start',
  },
  rsvpTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.ink,
  },
  rsvpSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 18,
    marginBottom: 4,
  },
  rsvpButton: { alignSelf: 'stretch' },
});
