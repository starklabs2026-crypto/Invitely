import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { fetchSavedCards } from '@/services/templates';
import { useTemplateStore } from '@/store/templateStore';
import { useAuth } from '@/hooks/useAuth';
import { TemplateCard } from '@/components/cards/TemplateCard';

type Tab = 'drafts' | 'completed' | 'favourites';

export default function MyDesignsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('drafts');
  const { user } = useAuth();
  const { favourites, cache, toggleFavourite } = useTemplateStore();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['saved-cards', user?.id, activeTab],
    queryFn: () =>
      user ? fetchSavedCards(user.id, activeTab === 'favourites' ? undefined : activeTab === 'drafts' ? 'draft' : 'completed') : Promise.resolve([]),
    enabled: !!user && activeTab !== 'favourites',
  });

  const favouriteTemplates = favourites.map((id) => cache[id]).filter(Boolean);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'drafts', label: 'Drafts' },
    { key: 'completed', label: 'Completed' },
    { key: 'favourites', label: 'Favourites' },
  ];

  const displayData = activeTab === 'favourites' ? favouriteTemplates : cards;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Designs</Text>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && activeTab !== 'favourites' ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : displayData.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>✦</Text>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'favourites'
              ? 'Heart templates you love to save them here'
              : activeTab === 'drafts'
              ? 'Start designing to save drafts'
              : 'Complete a design to see it here'}
          </Text>
          {activeTab !== 'favourites' && (
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/categories')}
            >
              <Text style={styles.browseText}>Browse templates</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item: any) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          renderItem={({ item }: { item: any }) => {
            if (activeTab === 'favourites') {
              return (
                <TemplateCard
                  template={item}
                  onPress={(id) => router.push(`/template/${id}`)}
                  onFavourite={toggleFavourite}
                  isFavourited={true}
                />
              );
            }
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/editor/${item.template_id}`)}
                activeOpacity={0.9}
              >
                {item.templates?.thumb_url ? (
                  <Image source={{ uri: item.templates.thumb_url }} style={styles.cardImage} />
                ) : (
                  <View style={styles.cardPlaceholder} />
                )}
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.templates?.name ?? 'Draft'}
                </Text>
                <Text style={styles.cardDate}>
                  {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: COLORS.ink,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.muted,
  },
  tabLabelActive: { color: COLORS.white },
  grid: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 32 },
  gridRow: { gap: 12, paddingHorizontal: 4 },
  card: { flex: 1, marginBottom: 16 },
  cardImage: { aspectRatio: 5 / 7, borderRadius: 12, backgroundColor: COLORS.bg2 },
  cardPlaceholder: {
    aspectRatio: 5 / 7,
    borderRadius: 12,
    backgroundColor: COLORS.bg2,
  },
  cardName: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.ink,
    marginTop: 6,
  },
  cardDate: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 32,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.ink,
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  browseButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  browseText: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.white,
  },
});
