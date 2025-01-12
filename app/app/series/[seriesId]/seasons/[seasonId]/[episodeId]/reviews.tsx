import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ReviewsDisplay from '@/components/reviews/ReviewsDisplay';
import OptionsTab from '@/components/OptionsTab';

import { fetchReviewsByEpisodeId } from '@/api/reviewsApi';

export default function EpisodesReviewsScreen() {
  const router = useRouter();
  const { seriesId, seasonId, episodeId } = useLocalSearchParams<{ seriesId: string; seasonId: string; episodeId: string }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [seasonNumber, setSeasonNumber] = useState(0);
  const [episodeNumber, setEpisodeNumber] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchReviewsByEpisodeId(episodeId);
  
      if (data?.length > 0) {
        const mappedReviews = data.map((review: any) => ({
          id: review?.review_id,
          rating: review?.score,
          review: review?.comment,
          likes: review?.likeCount || 0,
          comments: review?.comments?.length || 0,
          username: review?.user?.name,
          avatar: review?.user?.avatar,
          liked: false,
        }));

        const episodeResponse = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`);
        const episodeData = await episodeResponse.json();
        setEpisodeNumber(episodeData.number);
        setSeasonNumber(episodeData.season)
  
        setReviews(mappedReviews)
      } else {
        setReviews([])
      }
    }
  
    fetchData();
  }, [])

  return (
    <SafeAreaView style={styles.mainContainer}>
      <OptionsTab type="back" onBackPress={() => router.back()}></OptionsTab>
      <Text style={styles.heading}>S{seasonNumber} E{episodeNumber} - Reviews</Text>
      
      <ScrollView contentContainerStyle={styles.reviewsList}>
        <ReviewsDisplay reviews={reviews} type="all" page="episode" seasonNumber={seasonId} seriesId={seriesId} episodeNumber={episodeId}/>
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
