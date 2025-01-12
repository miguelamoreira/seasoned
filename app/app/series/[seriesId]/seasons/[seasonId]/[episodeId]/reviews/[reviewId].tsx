import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';

import ReviewsDisplay from '@/components/reviews/ReviewsDisplay'; 
import OptionsTab from '@/components/OptionsTab';
import OptionsButton from '@/components/OptionsButton';
import LikedBy from '@/components/reviews/LikedBy';

import { fetchReviewById } from '@/api/reviewsApi';

export default function EpisodesReviewScreen() {
  const { user, token } = useUserContext();
  const router = useRouter();
  const { seriesId, seasonId, episodeId, reviewId } = useLocalSearchParams<{ seriesId: string, seasonId: string; episodeId: string; reviewId: string }>();
  const [review, setReview] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchReviewById(reviewId);
  
      if (data) {
        const formattedReview = {
          id: data?.review_id,
          rating: data?.score,
          review: data?.comment,
          likes: data?.likes?.length || 0,
          likedUsers: data?.likes?.map((like: any) => ({
            name: like?.user?.name,
            avatar: like?.user?.avatar, 
          })) || [], 
          comments: data?.comments?.length || 0,
          allComments: data?.comments || [],
          username: data?.user?.name,
          avatar: data?.user?.avatar,
          liked: false,
        }
  
        setReview([formattedReview])
      } else {
        setReview([])
      }
    };
  
    fetchData();
  }, [])

  return (
    <SafeAreaView style={styles.mainContainer}>
      <OptionsTab type="back" onBackPress={() => router.back()}></OptionsTab>
      
      {review && (
        <>
            <Text style={styles.heading}>Review</Text>
          
            <ReviewsDisplay reviews={review} type="all"/>

            <LikedBy likedUsers={review[0]?.likedUsers || []} ></LikedBy>
          
            <Text style={styles.subHeading}>Comments</Text>
            <OptionsButton option="addComment" onPress={() => router.push(`/series/${seriesId}/seasons/${seasonId}/${episodeId}/reviews/${reviewId}/addComment`)} disabled={!token}></OptionsButton>
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
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF4E0',
    paddingHorizontal: 16,
    paddingTop: 42,
    color: '#211B17'
  },
  heading: {
    fontSize: 24,
    fontFamily: 'DMSerifText',
    lineHeight: 45,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 20,
    fontFamily: 'DMSerifText',
    lineHeight: 35,
    marginTop: 24,
    marginBottom: 12,
  },
});