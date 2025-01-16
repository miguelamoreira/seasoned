import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';

import ReviewsDisplay from '@/components/reviews/ReviewsDisplay';
import OptionsTab from '@/components/OptionsTab';
import OptionsButton from '@/components/OptionsButton';
import LikedBy from '@/components/reviews/LikedBy';

import { fetchReviewById } from '@/api/reviewsApi';
import { fetchLikedReviews } from '@/api/reviewLikesApi';

export default function SeriesReviewScreen() {
  const { user, token } = useUserContext();
  const router = useRouter();
  const { seriesId, reviewId } = useLocalSearchParams<{ seriesId: string, reviewId: string }>();
  const [review, setReview] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchReviewById(reviewId);

      if (data) {
        const likedUsers = data?.likes?.map((like: any) => ({
          name: like?.user?.name,
          avatar: like?.user?.avatar, 
          userId: like?.user?.user_id,
        })) || [];

        const isLiked = likedUsers.some((like: { userId: number | undefined; }) => like.userId === user?.user_id);

        const formattedReview = {
          id: data?.review_id,
          rating: data?.score,
          review: data?.comment,
          likes: data?.likes?.length,
          likedUsers: likedUsers,
          comments: data?.comments?.length || 0,
          allComments: data?.comments || [],
          username: data?.user?.name,
          avatar: data?.user?.avatar,
          liked: isLiked,
        };

        setReview([formattedReview]);
      } else {
        setReview([]);
      }
    };

    fetchData();
  }, [reviewId, user?.user_id]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <OptionsTab type="back" onBackPress={() => router.back()}></OptionsTab>
      
      {review && (
        <>
            <Text style={styles.heading}>Review</Text>
          
            <View style={{ paddingHorizontal: 16 }}>
              <ReviewsDisplay reviews={review} type="all" seriesId={seriesId} />

              <LikedBy likedUsers={review[0]?.likedUsers || []} />
            
              <Text style={styles.subHeading}>Comments</Text>

              <OptionsButton option="addComment" onPress={() => router.push(`/series/${seriesId}/reviews/${reviewId}/addComment`)} disabled={!token}></OptionsButton>
              
              <ReviewsDisplay
                reviews={review[0]?.allComments?.map((comment: { comment: string; user: { name: string, avatar: string } }, index: number) => ({
                  id: index + 1,
                  username: comment.user.name, 
                  review: comment.comment, 
                  liked: false,
                  comments: 0,
                  likes: 0,
                  rating: 0,
                  avatar: comment.user.avatar,
                  year: 2024,
                  title: '',
                })) || []}
                type="comment"
                seriesId={seriesId}
              />
            </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF4E0',
    paddingTop: 42,
    color: '#211B17'
  },
  heading: {
    fontSize: 24,
    fontFamily: 'DMSerifText',
    lineHeight: 45,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  subHeading: {
    fontSize: 20,
    fontFamily: 'DMSerifText',
    lineHeight: 35,
    marginTop: 24,
    marginBottom: 12,
  },
});