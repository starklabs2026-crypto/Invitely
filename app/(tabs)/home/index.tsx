import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { CATEGORIES } from '@/constants/categories';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryCircle } from '@/components/cards/CategoryCircle';
import { TrendingCard } from '@/components/cards/TrendingCard';
import { useTemplates } from '@/hooks/useTemplates';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { data: templates = [], isLoading } = useTemplates();
  const trendingTemplates = templates.slice(0, 8);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        <View style={styles.searchBar}>
          <Text style={styles.logo}>Invitely</Text>
          <SearchBar
            placeholder="Search templates..."
            onFocus={() => router.push('/(tabs)/home/search')}
            editable={false}
          />
        </View>

        <SectionHeader
          title="Popular categories"
          onSeeAll={() => router.push('/(tabs)/categories')}
          style={styles.sectionHeader}
        />
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <CategoryCircle
              category={item}
              onPress={() => router.push(`/(tabs)/categories/${item.id}`)}
            />
          )}
        />

        <SectionHeader
          title="Trending now"
          onSeeAll={() => router.push('/(tabs)/categories')}
          style={styles.sectionHeader}
        />
        {isLoading ? (
          <View style={styles.loadingRow}>
            {[1, 2].map((i) => (
              <View
                key={i}
                style={[styles.skeleton, { width: SCREEN_WIDTH * 0.56, height: SCREEN_WIDTH * 0.56 * 1.3 }]}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={trendingTemplates}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
            renderItem={({ item }) => (
              <TrendingCard
                template={item}
                onPress={() => router.push(`/template/${item.id}`)}
              />
            )}
          />
        )}

        <TouchableOpacity
          onPress={() => router.push('/ai-generate')}
          style={styles.bannerContainer}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[COLORS.primary, '#8B3A20']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Ionicons name="sparkles" size={24} color={COLORS.white} />
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Magic Invite</Text>
                <Text style={styles.bannerSubtitle}>
                  AI-powered invitations — coming soon
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchBar: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  logo: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: COLORS.primary,
  },
  sectionHeader: { marginTop: 24, marginBottom: 8 },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 16,
    paddingVertical: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  skeleton: {
    borderRadius: 16,
    backgroundColor: COLORS.bg2,
  },
  trendingList: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 4,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
});
