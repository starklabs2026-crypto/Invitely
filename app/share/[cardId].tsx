import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/store/editorStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ShareScreen() {
  const capturedUri = useEditorStore((s) => s.capturedUri);
  const template = useEditorStore((s) => s.template);
  const [sharing, setSharing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleShare() {
    if (!capturedUri) {
      Alert.alert('No card', 'Please complete your design first.');
      return;
    }
    setSharing(true);
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Not available', 'Sharing is not available on this device.');
        return;
      }
      await Sharing.shareAsync(capturedUri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your invitation',
      });
    } catch {
      Alert.alert('Share failed', 'Could not share the card. Please try again.');
    } finally {
      setSharing(false);
    }
  }

  async function handleSave() {
    if (!capturedUri) {
      Alert.alert('No card', 'Please complete your design first.');
      return;
    }
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please allow access to your photo library in Settings.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(capturedUri);
      Alert.alert('Saved!', 'Your invitation has been saved to your photo library.');
    } catch {
      Alert.alert('Error', 'Could not save to gallery. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const aspectRatio = template?.aspect_ratio ?? '7:5';
  const [w, h] = aspectRatio.split(':').map(Number);
  const previewWidth = SCREEN_WIDTH - 80;
  const previewHeight = previewWidth * (h / w);

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
          {capturedUri ? (
            <Image
              source={{ uri: capturedUri }}
              style={[styles.preview, { width: previewWidth, height: previewHeight }]}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.preview, styles.previewPlaceholder, { width: previewWidth, height: previewHeight }]}>
              <Text style={styles.placeholderText}>Preview not available</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Share via</Text>
        <View style={styles.shareRow}>
          <TouchableOpacity style={styles.shareButton} onPress={handleSave} disabled={saving}>
            <View style={[styles.shareIconWrap, { backgroundColor: COLORS.primary + '20' }]}>
              {saving ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : (
                <Ionicons name="download-outline" size={22} color={COLORS.primary} />
              )}
            </View>
            <Text style={styles.shareLabel}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare} disabled={sharing}>
            <View style={[styles.shareIconWrap, { backgroundColor: '#25D36620' }]}>
              {sharing ? (
                <ActivityIndicator color="#25D366" size="small" />
              ) : (
                <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
              )}
            </View>
            <Text style={styles.shareLabel}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare} disabled={sharing}>
            <View style={[styles.shareIconWrap, { backgroundColor: '#E1306C20' }]}>
              <Ionicons name="logo-instagram" size={22} color="#E1306C" />
            </View>
            <Text style={styles.shareLabel}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare} disabled={sharing}>
            <View style={[styles.shareIconWrap, { backgroundColor: COLORS.ink + '15' }]}>
              <Ionicons name="share-social-outline" size={22} color={COLORS.ink} />
            </View>
            <Text style={styles.shareLabel}>More</Text>
          </TouchableOpacity>
        </View>

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
