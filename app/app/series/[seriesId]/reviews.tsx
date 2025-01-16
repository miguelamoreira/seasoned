import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';

import ReviewsDisplay from '@/components/reviews/ReviewsDisplay'; 
import OptionsTab from '@/components/OptionsTab';

import { fetchReviewsBySeriesId } from '@/api/reviewsApi';
import { fetchLikedReviews } from '@/api/reviewLikesApi';

export default function SeriesReviewsScreen() {
  const { user } = useUserContext();
  const router = useRouter();
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [likedReviews, setLikedReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReviewsBySeriesId(seriesId);

        if (user?.user_id) {
          const likedData = await fetchLikedReviews(user?.user_id);
          setLikedReviews(likedData);

          if (data?.length > 0) {
            const mappedReviews = data.map((review: any) => {
              const isLiked = likedData.some(
                (likedReview: any) => likedReview.review_id === review.review_id
              );

              return {
                id: review?.review_id,
                rating: review?.score,
                review: review?.comment,
                likes: review?.likes?.length || 0,
                comments: review?.comments?.length || 0,
                username: review?.user?.name,
                avatar: review?.user?.avatar,
                liked: isLiked,
              };
            });

            setReviews(mappedReviews);
          } else {
            setReviews([]);
          }
        } else {
          if (data?.length > 0) {
            const mappedReviews = data.map((review: any) => ({
              id: review?.review_id,
              rating: review?.score,
              review: review?.comment,
              likes: review?.likes?.length || 0,
              comments: review?.comments?.length || 0,
              username: review?.user?.name,
              avatar: review?.user?.avatar,
              liked: false,
            }));

            setReviews(mappedReviews);
          } else {
            setReviews([]);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      }
    };

    fetchData();
  }, [seriesId, user?.user_id]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <OptionsTab type="back" onBackPress={() => router.back()} />
      <Text style={styles.heading}>Series Reviews</Text>

      <ScrollView contentContainerStyle={styles.reviewsList}>
        <ReviewsDisplay reviews={reviews} type="all" seriesId={seriesId} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF4E0',
    paddingTop: 42,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'DMSerifText',
    lineHeight: 45,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  reviewsList: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
});