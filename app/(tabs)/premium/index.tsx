import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

const FEATURES = [
  { label: 'Templates', free: '12 free', premium: 'All 50+' },
  { label: 'Downloads per month', free: '3', premium: 'Unlimited' },
  { label: 'Remove watermark', free: false, premium: true },
  { label: 'Priority support', free: false, premium: true },
  { label: 'AI Magic Invite', free: false, premium: true },
  { label: 'Custom fonts', free: false, premium: true },
  { label: 'HD export', free: false, premium: true },
];

const PLANS = [
  { label: 'Monthly', price: '₹199', period: '/mo', highlight: false },
  { label: 'Annual', price: '₹999', period: '/yr', highlight: true, saving: 'Save 58%' },
];

export default function PremiumScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={[COLORS.primary, '#8B3A20']}
          style={styles.hero}
        >
          <Ionicons name="diamond" size={40} color={COLORS.white} />
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock all templates, unlimited downloads, and AI-powered invite creation
          </Text>
        </LinearGradient>

        <View style={styles.plansRow}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.label}
              style={[styles.planCard, plan.highlight && styles.planCardHighlight]}
              activeOpacity={0.85}
            >
              {plan.highlight && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              <Text style={[styles.planLabel, plan.highlight && styles.planLabelHighlight]}>
                {plan.label}
              </Text>
              <Text style={[styles.planPrice, plan.highlight && styles.planPriceHighlight]}>
                {plan.price}
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </Text>
              {plan.saving && (
                <View style={styles.savingBadge}>
                  <Text style={styles.savingText}>{plan.saving}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>What you get</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, styles.headerText]}>Feature</Text>
              <Text style={[styles.col2, styles.headerText]}>Free</Text>
              <Text style={[styles.col3, styles.headerText]}>Premium</Text>
            </View>
            {FEATURES.map((f, i) => (
              <View key={f.label} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.col1, styles.featureLabel]}>{f.label}</Text>
                <View style={styles.col2}>
                  {typeof f.free === 'boolean' ? (
                    <Ionicons
                      name={f.free ? 'checkmark-circle' : 'close-circle'}
                      size={18}
                      color={f.free ? COLORS.sage : COLORS.border}
                    />
                  ) : (
                    <Text style={styles.featureValue}>{f.free}</Text>
                  )}
                </View>
                <View style={styles.col3}>
                  {typeof f.premium === 'boolean' ? (
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                  ) : (
                    <Text style={[styles.featureValue, { color: COLORS.primary }]}>{f.premium}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => Alert.alert('Coming soon', 'In-app purchases will be available soon.')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, '#A0522D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subscribeGradient}
          >
            <Ionicons name="diamond-outline" size={18} color={COLORS.white} />
            <Text style={styles.subscribeText}>Subscribe Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Cancel anytime. Prices in INR. Billed annually or monthly.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 48 },
  hero: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    gap: 12,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: COLORS.white,
  },
  heroSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 21,
  },
  plansRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  planCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg2,
    alignItems: 'center',
    gap: 4,
  },
  planCardHighlight: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.bg,
  },
  popularBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  popularText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.white,
  },
  planLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.muted,
  },
  planLabelHighlight: { color: COLORS.ink },
  planPrice: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.ink,
  },
  planPriceHighlight: { color: COLORS.primary },
  planPeriod: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
  },
  savingBadge: {
    backgroundColor: COLORS.sage,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  savingText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.white,
  },
  tableSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  tableTitle: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.ink,
    marginBottom: 12,
  },
  table: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg2,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerText: {
    fontFamily: FONTS.semibold,
    fontSize: 12,
    color: COLORS.muted,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRowAlt: { backgroundColor: COLORS.bg2 },
  col1: { flex: 2 },
  col2: { flex: 1, alignItems: 'center' },
  col3: { flex: 1, alignItems: 'center' },
  featureLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.ink,
  },
  featureValue: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.muted,
  },
  subscribeButton: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 16,
    overflow: 'hidden',
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  subscribeText: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.white,
  },
  disclaimer: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
  },
});
