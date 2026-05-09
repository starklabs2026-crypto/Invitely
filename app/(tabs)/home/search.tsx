import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { TemplateCard } from '@/components/cards/TemplateCard';
import { useTemplates } from '@/hooks/useTemplates';
import { useTemplateStore } from '@/store/templateStore';

type ContentType = 'invitations' | 'cards';
const FILTER_CHIPS = ['Birthday', 'Wedding', 'Baby Shower', 'Anniversary', 'Kids'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [contentType, setContentType] = useState<ContentType>('invitations');
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const { data: templates = [], isLoading } = useTemplates();
  const { favourites, toggleFavourite } = useTemplateStore();

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesQuery = query.length === 0 || t.name.toLowerCase().includes(query.toLowerCase());
      const matchesChip =
        activeChip === null ||
        t.category.toLowerCase().replace('_', ' ').includes(activeChip.toLowerCase()) ||
        t.style_tags.some((tag) => tag.toLowerCase().includes(activeChip.toLowerCase()));
      return matchesQuery && matchesChip;
    });
  }, [templates, query, activeChip]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            autoFocus
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.toggle}>
          {(['invitations', 'cards'] as ContentType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.toggleButton, contentType === type && styles.toggleActive]}
              onPress={() => setContentType(type)}
            >
              <Text style={[styles.toggleLabel, contentType === type && styles.toggleLabelActive]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={FILTER_CHIPS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              selected={activeChip === item}
              onPress={() => setActiveChip(activeChip === item ? null : item)}
            />
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            onPress={(id) => router.push(`/template/${id}`)}
            onFavourite={toggleFavourite}
            isFavourited={favourites.includes(item.id)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {query.length > 0 ? `No results for "${query}"` : 'No templates found'}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  backButton: { paddingRight: 4 },
  cancel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  toggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: COLORS.bg2,
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: COLORS.white },
  toggleLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.muted,
  },
  toggleLabelActive: { color: COLORS.ink },
  chips: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  grid: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  gridRow: {
    gap: 12,
    paddingHorizontal: 4,
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
  },
});
