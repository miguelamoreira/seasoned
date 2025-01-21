import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';
import { findEpisodeBySeriesId } from '@/api/episodesApi';
import { likeEpisodes, dislikeEpisodes } from '@/api/episodesLikesApi';
import { likeSeries, dislikeSeries, fetchLikedSeries } from '@/api/seriesLikesApi';
import { createReviews, fetchReviewsByUserId } from '@/api/reviewsApi';
import { fetchBadgeById, addEarnedBadge } from '@/api/badgesApi';
import { fetchRatingsGroupedByScore } from '@/api/reviewsApi';

import OptionsTab from '@/components/OptionsTab';
import Tabs from '@/components/logReviews/Tabs';
import SeriesDetails from '@/components/logReviews/SeriesDetails';
import RatingReviewContainer from '@/components/logReviews/RatingReviewContainer';
import EpisodeSelector from '@/components/logReviews/EpisodeSelector';

export default function SeriesLogScreen() {
    const router = useRouter();
    const { user, token } = useUserContext();
    const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
    const [isEpisodeView, setIsEpisodeView] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisodes, setSelectedEpisodes] = useState<{ [key: string]: boolean }>({});
    const [data, setData] = useState<{ [key: string]: { rating: number; review: string } }>({});

    const [seriesData, setSeriesData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await findEpisodeBySeriesId(seriesId);
                setSeriesData(response);
            } catch (err) {
                setError('Failed to load series data');
            }
        };

        fetchSeries();
    }, [seriesId]);

    const handleRatingChange = (key: string, rating: number) => {
        setData((prevData) => ({
            ...prevData,
            [key]: { ...prevData[key], rating },
        }));
    };

    const handleReviewChange = (key: string, text: string) => {
        setData((prevData) => ({
            ...prevData,
            [key]: { ...prevData[key], review: text },
        }));
    };

    const toggleHeart = async () => {
        if (isEpisodeView) {
            const selectedEpisodeIds = Object.keys(selectedEpisodes)
                .filter((key) => selectedEpisodes[key])
                .map((key) => {
                    const [season, episodeNumber] = key.split('-');
                    const episode = seriesData.seasons
                        .find((seasonData: any) => seasonData.number === parseInt(season))
                        ?.episodes.find((ep: any) => ep.number === parseInt(episodeNumber));
    
                    return episode ? episode.id : null;
                })
                .filter((id) => id !== null);
    
            for (const episodeId of selectedEpisodeIds) {
                if (liked) {
                    await dislikeEpisodes(user?.user_id, seriesId, episodeId);
                } else {
                    await likeEpisodes(user?.user_id, seriesId, episodeId);
                }
            }
        } else {
            if (liked) {
                await dislikeSeries(user?.user_id, seriesId);
            } else {
                await likeSeries(user?.user_id, seriesId);

                const likedSeries = await fetchLikedSeries(user?.user_id);
                const totalLikedSeries = likedSeries.length;
                
                if (totalLikedSeries >= 10) {
                    const badge = await fetchBadgeById(user?.user_id, 3);
                    if (!badge.earned) {
                        addEarnedBadge(user?.user_id, 3) 
                    }
                }                
            }
        }
    
        setLiked(!liked);
    };    

    const handleSaveReviews = async () => {
        const reviews = [];
        
        if (data['series']) {
            reviews.push({
                series_api_id: seriesId,
                score: data['series'].rating || null,
                comment: data['series'].review || null,
            });
        } 

        Object.keys(selectedEpisodes).forEach((key) => {
            if (selectedEpisodes[key]) {
                const [season, episode] = key.split('-').map(Number);
                const episodeId = seriesData.seasons
                    .find((seasonData: any) => seasonData.number === season)
                    ?.episodes.find((ep: any) => ep.number === episode)?.id;

                if (episodeId && data[key]) {
                    reviews.push({
                        series_api_id: seriesId,
                        episode_api_id: episodeId,
                        score: data[key].rating,
                        comment: data[key].review,
                    });
                }
            }
        });

        try {
            await createReviews(user?.user_id, reviews);

            const logs = await fetchReviewsByUserId(user?.user_id);
            const logsCount = logs.length
            validateBadgeCriteria(logsCount, 10, 17);

            const ratings = await fetchRatingsGroupedByScore(user?.user_id);
            const highRatingsCount = (ratings['4'] || 0) + (ratings['5'] || 0);
            validateBadgeCriteria(highRatingsCount, 5, 15)
            router.push(`/series/${seriesId}`)
        } catch (error) {
            console.error('Error creating reviews:', error);
        }
    };


    const toggleEpisodeSelection = (season: number, episode: { id: number; number: number }) => {
        const key = `${season}-${episode.number}`;
        setSelectedEpisodes((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const validateBadgeCriteria = async (dataCount: number, num: number, badgeId: number) => {
        try {
          const badge = await fetchBadgeById(user?.user_id, badgeId);
          if (!badge.earned) {
            if (dataCount >= num) {
              addEarnedBadge(user?.user_id, badgeId);
            }
          }
        } catch (error) {
          console.error("Error validating badge criteria:", error);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            { Object.keys(data).length !== 0 ? (
                <OptionsTab type="cross-check" onCrossPress={() => router.back()} onCheckPress={handleSaveReviews} />
            ) : <OptionsTab type="back" onCrossPress={() => router.back()}/> }

            <Text style={styles.heading}>Log / Review</Text>

            <Tabs isEpisodeView={isEpisodeView} onTabChange={(tab) => setIsEpisodeView(tab === 'Episodes')} />

            <ScrollView style={styles.content}>
                {seriesData ? (
                    <>
                        <SeriesDetails
                            title={seriesData.title}
                            year={seriesData.year}
                            image={seriesData.poster_url}
                        />

                        {!isEpisodeView && (
                            <RatingReviewContainer
                                key="series"
                                rating={data['series']?.rating || 0}
                                review={data['series']?.review || ''}
                                onRatingChange={(rating) => handleRatingChange('series', rating)}
                                onReviewChange={(text) => handleReviewChange('series', text)}
                                liked={liked}
                                onLikeToggle={toggleHeart}
                            />
                        )}

                        {isEpisodeView && (
                            <>
                                <EpisodeSelector
                                    selectedSeason={selectedSeason}
                                    onSeasonToggle={setSelectedSeason}
                                    selectedEpisodes={selectedEpisodes}
                                    onEpisodeToggle={toggleEpisodeSelection}
                                    seasonsData={seriesData.seasons.map((season: { number: any; episodes: any[] }) => ({
                                        season: season.number,
                                        episodes: season.episodes.map((ep: { id: number; number: number }) => ({
                                            id: ep.id,
                                            number: ep.number,
                                        })),
                                    }))}
                                />

                                {Object.keys(selectedEpisodes)
                                    .filter((key) => selectedEpisodes[key])
                                    .map((key) => {
                                        const [season, episode] = key.split('-').map(Number);
                                        return (
                                            <RatingReviewContainer
                                                key={key}
                                                title={`Season ${season}, Episode ${episode}`}
                                                rating={data[key]?.rating || 0}
                                                review={data[key]?.review || ''}
                                                onRatingChange={(rating) => handleRatingChange(key, rating)}
                                                onReviewChange={(text) => handleReviewChange(key, text)}
                                                liked={liked}
                                                onLikeToggle={toggleHeart}
                                            />
                                        );
                                    })}
                            </>
                        )}
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