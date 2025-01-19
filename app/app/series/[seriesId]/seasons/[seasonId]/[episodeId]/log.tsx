import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import EpisodeDetails from '@/components/logReviews/EpisodeDetails';
import RatingReviewContainer from '@/components/logReviews/RatingReviewContainer';

import { useUserContext } from '@/contexts/UserContext';
import { findEpisodeById } from '@/api/episodesApi';
import { createReviews } from '@/api/reviewsApi';
import { likeEpisodes, dislikeEpisodes } from '@/api/episodesLikesApi';

export default function EpisodeLogScreen() {
    const router = useRouter();
    const { user, token } = useUserContext();
    const { seriesId, seasonId, episodeId } = useLocalSearchParams<{ seriesId: string; seasonId: string; episodeId: string }>();
    
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>(''); 
    const [episodeData, setEpisodeData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                const response = await findEpisodeById(episodeId);
                setEpisodeData(response);
            } catch (error) {
                setError('Failed to load episode data');
            }
        };

        fetchEpisode();
    }, [episodeId]);

    const handleSaveReview = async () => {
        const reviews = [];

        try {
            reviews.push({
                series_api_id: seriesId,
                episode_api_id: episodeId,
                score: rating,
                comment: review,
            });

            await createReviews(user?.user_id, reviews);

            router.push(`/series/${seriesId}`);
        } catch (error) {
            console.error('Error saving review:', error);
            setError('Failed to save review');
        }
    };

    const toggleHeart = async () => {
        if (liked) {
            await dislikeEpisodes(user?.user_id, seriesId, episodeId);
        } else {
            await likeEpisodes(user?.user_id, seriesId, episodeId);
        }

        setLiked(!liked);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="cross-check" onCrossPress={() => router.back()} onCheckPress={handleSaveReview} />

            <Text style={styles.heading}>Log / Review</Text>

            <ScrollView style={styles.content}>
                {episodeData ? (
                    <>
                        <EpisodeDetails
                            image={episodeData?.image}
                            title={episodeData?.title}
                            season={episodeData?.season}
                            episode={episodeData?.episode}
                            series={episodeData?.series}
                        />

                        <RatingReviewContainer
                            rating={rating}
                            review={review}
                            onRatingChange={setRating}
                            onReviewChange={setReview}
                            liked={liked}
                            onLikeToggle={toggleHeart}
                        />
                    </>
                ) : (
                    <Text>{error || 'Loading...'}</Text>
                )}
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
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
});