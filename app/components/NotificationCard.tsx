import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import ReviewsDisplay from './reviews/ReviewsDisplay';

type NotificationCardProps = {
  type: string;
  variant: 'newComments' | 'earnedBadges' | 'newFollowers' | 'newLikes';
  data: {
    user?: string;
    avatar?: string;
    review?: any[] | any;
    comment?: any[] | any;
    message?: string;
  };
  read: boolean;
};

export default function NotificationCard({ type, variant, data, read }: NotificationCardProps) {
  const renderCircle = () => (
    <View style={[styles.iconCircle, { opacity: read ? 0.5 : 1 }]} />
  );

  if (type === 'activity') {
    if (variant === 'newLikes') {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            {renderCircle()}
            {data.avatar && (
              <Image source={{ uri: data.avatar }} style={styles.notificationAvatar} />
            )}
            <Text style={styles.notificationTitle} numberOfLines={2}>
              <Text>{data.message}</Text>
            </Text>
          </View>
          <ReviewsDisplay type="notifications" reviews={[data.review]} />
        </View>
      );
    } else if (variant === 'newFollowers') {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            {renderCircle()}
            {data.avatar && (
              <Image source={{ uri: data.avatar }} style={styles.notificationAvatar} />
            )}
            <Text style={styles.notificationTitle}>
              <Text>{data.message}</Text>
            </Text>
          </View>
        </View>
      );
    } else if (variant === 'newComments') {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            {renderCircle()}
            {data.avatar && (
              <Image source={{ uri: data.avatar }} style={styles.notificationAvatar} />
            )}
            <Text style={styles.notificationTitle} numberOfLines={2}>
              <Text>{data.message}</Text>
            </Text>
          </View>
          <ReviewsDisplay type="notifications" reviews={[data.comment]} />
        </View>
      );
    } else if (variant === 'earnedBadges') {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            {renderCircle()}
            <Text style={styles.notificationTitle} numberOfLines={2}>
              <Text>{data.message}</Text>
            </Text>
          </View>
        </View>
      );
    }
  }

  return null;
}

const styles = StyleSheet.create({
  notificationCard: {
    flexDirection: 'column',
    paddingHorizontal: 4,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: '#211B17',
    width: 300,
  },
  notificationHighlight: {
    fontWeight: '700',
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#211B17',
    marginRight: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#211B17',
    backgroundColor: '#D8A84E',
    marginRight: 12,
    alignSelf: 'center',
  },
});
