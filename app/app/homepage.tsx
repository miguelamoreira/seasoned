import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';

import FrankieBanner from '@/components/homepage/FrankieBanner';
import ComingSoon from '@/components/homepage/ComingSoon';
import PopularReviews from '@/components/homepage/PopularReviews';
import PopularShows from '@/components/homepage/PopularShows';
import ContinueWatching from '@/components/homepage/ContinueWatching';
import TabBar from '@/components/TabBar';

import { fetchNewReleases } from '@/api/tvAPI';
import { fetchPopularReviews } from '@/api/reviewsApi';
import { fetchPopularSeries } from '@/api/seriesLikesApi';
import { fetchLikedReviews } from '@/api/reviewLikesApi';
import { fetchContinueWatching } from '@/api/userApi';
import { removeFollowedSeries } from "@/api/followedSeriesApi";
import { addDroppedSeries } from "@/api/droppedSeriesApi";

export default function HomepageScreen() {
    const { user, token } = useUserContext();
    const router = useRouter();
    const [newReleases, setNewReleases] = useState<any[]>([]);
    const [popularReviews, setPopularReviews] = useState<any[]>([]);
    const [popularShows, setPopularShows] = useState<any[]>([]);
    const [likedReviews, setLikedReviews] = useState<any[]>([]);
    const [episodeData, setEpisodeData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newShows = await fetchNewReleases();
                if (!newShows.error) setNewReleases(newShows);

                const reviewData = await fetchPopularReviews();
                if (reviewData?.length > 0) {
                    if (user?.user_id) {
                        const likedData = await fetchLikedReviews(user?.user_id);
                        setLikedReviews(likedData);

                        const firstReview = reviewData[0];
                        const isLiked = likedData.some(
                            (likedReview: any) => likedReview.review_id === firstReview.reviewId
                        );

                        setPopularReviews([{
                            reviewId: firstReview?.reviewId,
                            imageUri: firstReview?.series?.posterUrl,
                            title: firstReview?.series?.title,
                            year: new Date(firstReview?.series?.year).getFullYear(),
                            rating: firstReview?.rating,
                            review: firstReview?.comment,
                            likes: firstReview?.likeCount || 0,
                            comments: firstReview?.comments?.length || 0,
                            username: firstReview?.user?.name,
                            avatarUri: firstReview?.user?.avatar,
                            liked: isLiked,
                        }]);
                    } else {
                        setPopularReviews([{
                            reviewId: reviewData[0]?.reviewId,
                            imageUri: reviewData[0]?.series?.posterUrl,
                            title: reviewData[0]?.series?.title,
                            year: new Date(reviewData[0]?.series?.year).getFullYear(),
                            rating: reviewData[0]?.rating,
                            review: reviewData[0]?.comment,
                            likes: reviewData[0]?.likeCount || 0,
                            comments: reviewData[0]?.comments?.length || 0,
                            username: reviewData[0]?.user?.name,
                            avatarUri: reviewData[0]?.user?.avatar,
                            liked: false,
                        }]);
                    }
                } else {
                    setPopularReviews([]);
                }

                const seriesData = await fetchPopularSeries();
                if (Array.isArray(seriesData) && seriesData.length > 0) {
                    const shows = seriesData.slice(0, 4).map((series: any) => ({
                        seriesId: series.series_api_id,
                        imageUri: series.poster_url,
                    }));
                    setPopularShows(shows);
                } else {
                    setPopularShows([]);
                }

                if (user?.user_id) {
                    try {
                        const continueWatchingData = await fetchContinueWatching(user?.user_id);
                        if (continueWatchingData?.next_episode) {
                            const nextEpisode = continueWatchingData.next_episode;
                
                            const {
                                title = "Unknown Title",
                                season = "N/A",
                                number = "N/A",
                                runtime = 0,
                                image = null,
                                episode_id,
                            } = nextEpisode;
                
                            const {
                                series_title = "Unknown Series",
                                series_id,
                                season_id,
                            } = continueWatchingData?.last_watched || {};
                
                            setEpisodeData({
                                title,
                                seasonEpisode: `S-${season} E-${number}`,
                                duration: `${runtime || "?"} min`,
                                seriesTitle: series_title,
                                imageUri: image || "default_image_placeholder.png",
                                seriesId: series_id,
                                seasonId: season_id,
                                episodeId: episode_id,
                            });
                        } else {
                            setEpisodeData(null);
                        }
                    } catch (error) {
                        console.error("Error fetching continue watching data:", error);
                        setEpisodeData(null);
                    }
                }                
            } catch (error) {
                console.error('Error fetching data: ', error);
                setPopularShows([]);
                setPopularReviews([]);
                setNewReleases([]);
            }
        };

        fetchData();
    }, [user?.user_id]);

    const handleUnfollow = async () => {
       if (episodeData) {
            await removeFollowedSeries(user?.user_id, episodeData.seriesId);
            await addDroppedSeries(user?.user_id, episodeData.seriesId);
            setEpisodeData(null);
       }
    };

    const handleLog = () => {
        if (episodeData) {
            router.push(`/series/${episodeData.seriesId}/seasons/${episodeData.seasonId}/${String(episodeData.episodeId)}/log`);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {!token && <FrankieBanner />}
                {token && user && episodeData && episodeData !== null && (
                    <ContinueWatching episode={episodeData} onUnfollow={handleUnfollow} handleLog={handleLog} />
                )}
                <ComingSoon shows={newReleases} />
                <PopularReviews reviews={popularReviews} />
                <PopularShows shows={popularShows} />
            </ScrollView>

            <TabBar isLoggedIn={!!token} currentPage="Home" userId={user?.user_id || null} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
        color: '#211B17',
        fontFamily: 'Arimo',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingBottom: 80,
    },
});