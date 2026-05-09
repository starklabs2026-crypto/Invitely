import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTemplate } from '@/hooks/useTemplates';
import { useTemplateStore } from '@/store/templateStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_WIDTH = SCREEN_WIDTH - 48;
const PREVIEW_HEIGHT = PREVIEW_WIDTH * (7 / 5);

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: template, isLoading, isError, refetch } = useTemplate(id!);
  const { favourites, toggleFavourite } = useTemplateStore();
  const isFavourited = favourites.includes(id!);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !template) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load template</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavourite(template.id)}
          style={styles.headerButton}
        >
          <Ionicons
            name={isFavourited ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavourited ? '#E53935' : COLORS.ink}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: template.bg_image_url }}
            style={styles.preview}
            resizeMode="cover"
            defaultSource={require('@/assets/placeholder.png')}
          />
          {template.tier === 'premium' && (
            <View style={styles.tierBadge}>
              <Badge type="premium" />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{template.name}</Text>
            <Badge type={template.tier} />
          </View>

          {template.color_palette.length > 0 && (
            <View style={styles.colorsSection}>
              <Text style={styles.colorLabel}>Color variants</Text>
              <View style={styles.colorDots}>
                {template.color_palette.map((color, i) => (
                  <TouchableOpacity key={i} style={[styles.colorDot, { backgroundColor: color }]} />
                ))}
              </View>
            </View>
          )}

          <View style={styles.tags}>
            {template.style_tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Use this template"
          onPress={() => router.push(`/editor/${template.id}`)}
          size="lg"
          style={styles.ctaButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.muted },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  retryText: { fontFamily: FONTS.semibold, fontSize: 13, color: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: { padding: 6 },
  scroll: { paddingBottom: 120 },
  previewContainer: {
    alignSelf: 'center',
    marginTop: 24,
    width: PREVIEW_WIDTH,
    height: PREVIEW_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  tierBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  info: {
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: COLORS.ink,
    flex: 1,
    marginRight: 8,
  },
  colorsSection: { gap: 8 },
  colorLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.muted,
  },
  colorDots: { flexDirection: 'row', gap: 8 },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.muted,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ctaButton: { borderRadius: 16 },
});
