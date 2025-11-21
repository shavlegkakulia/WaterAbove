import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Header,
  TopReflectiveBorderSvg,
  BottomReflectiveBorderSvg,
  Icon,
  CircularProgressBar,
  IconName,
  PrimaryActionButton,
} from '@/components';
import { AuthScreenWrapper } from '@/components/AuthScreenWrapper';
import { borderRadius, colors, spacing } from '@/theme';
import { getWindowWidth, moderateScale } from '@/utils';
import archiveCard from '@/assets/images/archiveCard.png';
import type { ArchiveCard } from '@/types/archive';

const ARCHIVE_CARD_WIDTH = (getWindowWidth() - 34 - spacing.sm) / 2;

export const ArchiveHomeScreen: React.FC = () => {
  const archiveCards: ArchiveCard[] = [
    {
      id: '1',
      title: '9-Week Accelerator',
      icon: 'BookOpen',
      image:
        'https://images.unsplash.com/photo-1589362281138-e3f7ebe47f1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '2',
      title: 'New Lecture',
      image:
        'https://images.unsplash.com/photo-1589362281138-e3f7ebe47f1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '3',
      title: '2025 Meeting Archive',
      image:
        'https://images.unsplash.com/photo-1589362281138-e3f7ebe47f1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '4',
      title: 'Special Guest Interviews',
      image:
        'https://images.unsplash.com/photo-1589362281138-e3f7ebe47f1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  return (
    <AuthScreenWrapper withScrollView={false} bgColor={colors.backgroundDark}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.upperCardsSection}>
          <ImageBackground source={archiveCard} style={styles.card}>
            <TopReflectiveBorderSvg
              width={ARCHIVE_CARD_WIDTH}
              height={moderateScale(spacing.md)}
              radius={moderateScale(borderRadius.xl)}
            />
            <View style={styles.cardContent}>
              <Text
                variant="body16Bold"
                color="success"
                style={styles.cardTitle}
              >
                Latest Lesson Upload
              </Text>
              <Text
                variant="caption12Bold"
                color="textSecondary"
                style={styles.cardSubtitle}
              >
                SPECIAL GUEST INTERVIEW
              </Text>
              <Text
                variant="caption12Bold"
                color="textSecondary"
                style={styles.cardDate}
              >
                11/01/2026
              </Text>
              <PrimaryActionButton
                title="LISTEN NOW"
                icon="AudioWaveform"
                iconSize={moderateScale(24)}
                radius={moderateScale(borderRadius.xxl)}
                containerStyle={styles.listenButton}
              />
            </View>
            <BottomReflectiveBorderSvg
              width={ARCHIVE_CARD_WIDTH}
              height={moderateScale(spacing.md)}
              radius={moderateScale(borderRadius.xl)}
              style={styles.bottomBorder}
            />
          </ImageBackground>
          <ImageBackground source={archiveCard} style={styles.card}>
            <TopReflectiveBorderSvg
              width={ARCHIVE_CARD_WIDTH}
              height={moderateScale(spacing.md)}
              radius={moderateScale(borderRadius.xl)}
            />
            <View style={styles.cardContent}>
              <Text
                variant="body16Bold"
                color="success"
                style={styles.cardTitle}
              >
                University Progress
              </Text>
              <Text
                variant="caption12Bold"
                color="textSecondary"
                style={[styles.cardSubtitle, styles.cardSubtitleProgress]}
              >
                {`You have completed\n102 of 147\ncourse lessons`}
              </Text>
              <View style={styles.progressCircleContainer}>
                <CircularProgressBar
                  progress={75}
                  size={moderateScale(72)}
                  strokeWidth={moderateScale(9)}
                  gradientColors={[
                    { color: '#37B8CD', offset: '24.99%' },
                    { color: '#46C2A3', offset: '47.02%' },
                  ]}
                  gradientAngle={36}
                  unfilledColor={colors.gray700}
                  textColor={colors.white}
                  textPosition="inside"
                  insideText={`${Math.round(75)}%`}
                  textStyle={styles.progressText}
                />
              </View>
            </View>
            <BottomReflectiveBorderSvg
              width={ARCHIVE_CARD_WIDTH}
              height={moderateScale(spacing.md)}
              radius={moderateScale(borderRadius.xl)}
              style={styles.bottomBorder}
            />
          </ImageBackground>
        </View>
        <View style={styles.archiveHeader}>
          <Icon name="LibraryBig" size={moderateScale(24)} color="#46C2A3" />
          <Text variant="heading20Bold" style={styles.archiveTitle}>
            UNIVERSITY ARCHIVE
          </Text>
        </View>
        <View style={styles.archiveGrid}>
          {archiveCards.map(card => (
            <View key={card.id} style={styles.archiveCard}>
              <View style={styles.archiveCardImageOverlay} />
              <ImageBackground
                source={{ uri: card.image }}
                style={styles.archiveCardImage}
              >
                <TouchableOpacity style={styles.archiveCardOverlay}>
                  <View style={styles.archiveCardOverlayContent}>
                    {card.icon && (
                      <Icon
                        name={card.icon as IconName}
                        size={moderateScale(24)}
                        color={colors.white}
                      />
                    )}

                    <Text
                      variant="button14Semibold"
                      color="textWhiteWA"
                      style={styles.archiveCardTitle}
                    >
                      {card.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          ))}
        </View>
      </ScrollView>
    </AuthScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: moderateScale(spacing.xl),
  },
  upperCardsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(26),
    marginBottom: moderateScale(27),
    gap: moderateScale(spacing.sm),
  },
  card: {
    position: 'relative',
    borderRadius: moderateScale(borderRadius.xl),
    overflow: 'hidden',
  },
  cardContent: {
    width: ARCHIVE_CARD_WIDTH - 32,
    left: 17,
    top: -7,
  },
  cardTitle: {
    marginBottom: moderateScale(spacing.md),
    color: '#46C2A3',
    textAlign: 'center',
    width: '100%',
  },
  cardSubtitle: {
    marginBottom: moderateScale(spacing.sm),
    fontWeight: '700',
    textAlign: 'center',
    color: '#C7DBD6',
  },
  cardSubtitleProgress: {
    marginBottom: moderateScale(spacing.md),
  },
  cardDate: {
    marginBottom: moderateScale(spacing.md),
    textAlign: 'center',
    color: '#C7DBD6',
  },
  listenButton: {
    height: moderateScale(34),
    marginBottom: moderateScale(spacing.sm),
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  progressText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    lineHeight: moderateScale(20),
  },
  progressCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(20),
  },
  archiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(spacing.lg),
    gap: moderateScale(spacing.sm),
  },
  archiveTitle: {
    color: '#46C2A3',
    letterSpacing: moderateScale(1),
    textAlign: 'center',
  },
  archiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: moderateScale(spacing.md),
    marginBottom: moderateScale(spacing.xl),
  },
  archiveCard: {
    width: ARCHIVE_CARD_WIDTH - moderateScale(3),
    height: moderateScale(150),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    position: 'relative',
  },
  archiveCardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  archiveCardImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: moderateScale(12),
    zIndex: 1,
  },
  archiveCardOverlay: {
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    marginTop: moderateScale(-24), // -height/2
    zIndex: 1,
    alignSelf: 'center',
  },
  archiveCardOverlayContent: {
    paddingHorizontal: moderateScale(spacing.sm),
    backgroundColor: 'rgba(23, 27, 34, 0.90)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(spacing.xs),
    height: moderateScale(48),
    borderRadius: moderateScale(34),
  },
  archiveCardTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ArchiveHomeScreen;
