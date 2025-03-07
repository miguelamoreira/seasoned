import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import Menu from '@/components/users/Menu';
import EmptyState from '@/components/EmptyState';
import ReviewsDisplay from '@/components/reviews/ReviewsDisplay';
import EpisodesDisplay from '@/components/episodes/EpisodesDisplay';
import CoverDisplay from '@/components/series/Cover';
import FilterTabs from '@/components/FilterTabs';

import { fetchReviewsByUserId } from '@/api/reviewsApi';
import { fetchLikedEpisodes } from '@/api/episodesLikesApi'
import { fetchLikedSeries } from '@/api/seriesLikesApi'
import { fetchLikedReviews } from '@/api/reviewLikesApi';

const TABS: { label: string; icon: string; library: "FontAwesome" | "AntDesign" }[] = [
    { label: 'Reviews', icon: 'bookmark', library: 'FontAwesome' },
    { label: 'Likes', icon: 'heart', library: 'AntDesign' },
];

const LIKES_SUBTABS = [
    { label: 'Episodes', key: 'Episodes' },
    { label: 'Series', key: 'Series' },
    { label: 'Reviews', key: 'Reviews' },
];

export default function UsersActivityScreen() {
    const { userId, activeTab: initialActiveTab } = useLocalSearchParams<{ userId: string; activeTab: string }>();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'Reviews' | 'Likes'>(
        (initialActiveTab as 'Reviews' | 'Likes') || 'Reviews'
    );
    const [activeSubTab, setActiveSubTab] = useState<string | null>('Episodes');
    const [userReviews, setUserReviews] = useState([]);
    const [likedEpisodes, setLikedEpisodes] = useState([]);
    const [likedSeries, setLikedSeries] = useState([]);
    const [likedReviews, setLikedReviews] = useState([]);

    useEffect(() => {
        if (userId) {
            const fetchReviews = async () => {
                try {
                    const reviews = await fetchReviewsByUserId(userId);
                    const formattedReviews = reviews.map((review: any) => ({
                        id: review.id,
                        title: review.series.title,
                        year: review.series.release_date.split('-')[0],
                        review: review.comment,
                        rating: review.score,
                        likes: review.likes.length,
                        comments: review.comments.length,
                        image: review.series.poster_url,
                        liked: review.liked,
                    }));
                    setUserReviews(formattedReviews);
                } catch (error) {
                    console.error('Error fetching user reviews:', error);
                }
            };
            fetchReviews();
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const fetchLikedEpisodesData = async () => {
                try {
                    const liked = await fetchLikedEpisodes(userId);
                    
                    const formattedLikedEpisodes = liked.map((episode: any) => ({
                        id: episode.episode_api_id,
                        title: episode.title,
                        year: episode.air_date.split('-')[0],
                        date: episode.air_date.split('T')[0],
                        season: episode.season,
                        episode: episode.episode_number,
                        rating: episode.rating_average,
                        image: episode.image,
                    }));
                    setLikedEpisodes(formattedLikedEpisodes);
                } catch (error) {
                    console.error('Error fetching liked episodes:', error);
                }
            };
            fetchLikedEpisodesData();
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const fetchLikedSeriesData = async () => {
                try {
                    const liked = await fetchLikedSeries(userId);
                    const formattedLikedSeries = liked.map((series: any) => ({
                        series_api_id: series.series_api_id,
                        title: series.title,
                        description: series.description,
                        release_date: series.release_date,
                        genre: series.genre,
                        total_seasons: series.total_seasons,
                        average_rating: series.average_rating,
                        poster_url: series.poster_url,
                        creator: series.creator,
                    }));
                    setLikedSeries(formattedLikedSeries);
                } catch (error) {
                    console.error('Error fetching liked series:', error);
                }
            };
            fetchLikedSeriesData();
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const fetchLikedReviewsData = async () => {
                try {
                    const liked = await fetchLikedReviews(userId);
                    const formattedLikedReviews = liked.map((likedReview: any) => ({
                        id: likedReview.review_id,
                        title: likedReview.reviews.series.title,
                        year: likedReview.reviews.series.release_date.split('-')[0],
                        review: likedReview.reviews.comment,
                        rating: likedReview.reviews.score,
                        likes: likedReview.reviews.likes.length,
                        comments: likedReview.reviews.comments.length,
                        image: likedReview.reviews.series.poster_url,
                        avatar: likedReview.reviews.user.avatar,
                        username: likedReview.reviews.user.name,
                        liked: true,
                        user_id: likedReview.user_id,
                    }));
                    setLikedReviews(formattedLikedReviews);
                } catch (error) {
                    console.error('Error fetching liked reviews:', error);
                }
            };
            fetchLikedReviewsData();
        }
    }, [userId]);
    
    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'Reviews' | 'Likes');
    };

    const handleSubTabChange = (subTab: string | null) => {
        setActiveSubTab(subTab);
    };

    const renderLikes = () => {
        switch (activeSubTab) {
            case 'Episodes':
                return <EpisodesDisplay episodes={likedEpisodes} type="default" seriesId="123" seasonNumber="1"/>;
            case 'Series':
                return (
                    <CoverDisplay
                        covers={likedSeries.map((series) => ({series_api_id: series.series_api_id, image: series.poster_url, title: series.title }))}
                        type="default"
                    />
                );
            case 'Reviews':
                return <ReviewsDisplay reviews={likedReviews} type="notOwn" userId={Number(userId)} page="profile"/>
            default:
                return <EmptyState type="404" />;
        }
    };

    const renderContent = () => {
        if (activeTab === 'Reviews') {
            if (userReviews.length === 0) {
                return <EmptyState type="noReviews" />;
            }

            return <ReviewsDisplay reviews={userReviews} type="own" />;
        }

        if (activeTab === 'Likes') {
            if (likedEpisodes.length === 0 && likedSeries.length === 0 && likedReviews.length === 0) {
                return <EmptyState type="noLikes" />;
            }
            
            return (
                <View>
                    <FilterTabs tabs={LIKES_SUBTABS} onTabChange={handleSubTabChange} initialTab="Episodes" allowNoneSelected={false}/>
                    {renderLikes()}
                </View>
            );
        }
        return <EmptyState type="404" />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            <Menu tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />
            <FlatList
                data={[1]}
                renderItem={() => renderContent()}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.contentContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    contentContainer: {
        paddingHorizontal: 16,
    }
});