import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';
import { findSeriesById } from '@/api/seriesApi';
import { fetchLikedReviews } from '@/api/reviewLikesApi';

import OptionsTab from '@/components/OptionsTab';
import SeriesHeader from '@/components/series/SeriesHeader';
import SeriesDetails from '@/components/series/SeriesDetails';
import SeriesBio from '@/components/series/SeriesBio';
import SeriesCast from '@/components/series/SeriesCast';
import SeriesSeasons from '@/components/series/SeriesSeasons';
import ReviewsContainer from '@/components/series/ReviewsContainer';
import SeriesAlert from '@/components/series/SeriesAlert';
import LogButton from '@/components/series/LogButton';
import TabBar from '@/components/TabBar';

export default function SeriesScreen() {
    const { user, token } = useUserContext();
    const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [seriesData, setSeriesData] = useState<any | null>(null);
    const [likedReviews, setLikedReviews] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const data = await findSeriesById(seriesId);
                setSeriesData(data);

                if (user?.user_id) {
                    const likedData = await fetchLikedReviews(user?.user_id);
                    setLikedReviews(likedData);
                }
            } catch (err) {
                setError('Failed to load series data');
            }
        };

        fetchSeries();
    }, [seriesId, user?.user_id]);

    const handleModalState = (isOpen: boolean) => {
        setIsModalOpen(isOpen);
    };

    if (!seriesData && !error) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D8A84E50" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>{error}</Text>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: string }) => {
        if (item === 'content') {
            return (
                <>
                    <SeriesHeader image={seriesData?.poster_url} />
                    <SeriesDetails
                        title={seriesData?.title}
                        year={seriesData?.year}
                        creator={seriesData?.creator}
                        genres={seriesData?.genre}
                    />
                    <SeriesBio bio={seriesData?.description} />
                    {seriesData?.ended === null && <SeriesAlert release={seriesData?.release_date} />}
                    <LogButton
                        onModalToggle={handleModalState}
                        navigation={undefined}
                        type="series"
                        disabled={!token}
                    />
                    <SeriesCast cast={seriesData?.cast} />
                    <SeriesSeasons
                        seasons={seriesData?.seasons || []}
                        seriesId={seriesData?.series_api_id}
                        userId={user?.user_id || null}
                    />
                    <ReviewsContainer
                        reviews={seriesData?.reviews.map((review: any) => ({
                            ...review,
                            liked: likedReviews.some(
                                (likedReview: any) => likedReview.review_id === review.id
                            ),
                            likes: review.likes,
                        }))}
                        type="series"
                        seriesId={seriesId}
                        ratings={seriesData?.ratings || []}
                    />
                </>
            );
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            <FlatList
                data={['content']}
                renderItem={renderItem}
                keyExtractor={() => 'content'}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
            <TabBar isLoggedIn={!!token} currentPage="" userId={user?.user_id || null} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF4E0',
    },
    flatListContent: {
        paddingBottom: 60,
    },
});