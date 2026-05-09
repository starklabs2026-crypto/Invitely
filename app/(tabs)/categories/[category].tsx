import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { CATEGORIES } from '@/constants/categories';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { TemplateCard } from '@/components/cards/TemplateCard';
import { useTemplates } from '@/hooks/useTemplates';
import { useTemplateStore } from '@/store/templateStore';
import type { TemplateCategory } from '@/types/template';

const SUB_FILTERS = ['All', 'Babies', 'Kids', "Men's", "Women's", 'Elegant', 'Floral', 'Minimal'];

export default function CategoryTemplatesScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [activeFilter, setActiveFilter] = useState('All');
  const categoryId = category as TemplateCategory;

  const categoryConfig = CATEGORIES.find((c) => c.id === categoryId);
  const { data: templates = [], isLoading, isError, refetch } = useTemplates(categoryId);
  const { favourites, toggleFavourite } = useTemplateStore();

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return templates;
    return templates.filter(
      (t) =>
        t.subcategory.some((s) => s.toLowerCase().includes(activeFilter.toLowerCase())) ||
        t.style_tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase()))
    );
  }, [templates, activeFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>{categoryConfig?.label ?? category}</Text>
          {!isLoading && (
            <Text style={styles.count}>{filtered.length} templates</Text>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          <FlatList
            data={SUB_FILTERS}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
            renderItem={({ item }) => (
              <CategoryChip
                label={item}
                selected={activeFilter === item}
                onPress={() => setActiveFilter(item)}
              />
            )}
          />
        }
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            onPress={(id) => router.push(`/template/${id}`)}
            onFavourite={toggleFavourite}
            isFavourited={favourites.includes(item.id)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
          ) : isError ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>Failed to load templates</Text>
              <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No templates found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  backButton: { padding: 4 },
  headerText: { flex: 1 },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.ink,
  },
  count: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 1,
  },
  filters: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    gap: 8,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  gridRow: {
    gap: 12,
    paddingHorizontal: 4,
  },
  center: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.muted,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  retryText: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.white,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.muted,
  },
});
