import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';
import { findSeriesById } from '@/api/seriesApi';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const data = await findSeriesById(seriesId);
                setSeriesData(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load series data');
                setLoading(false);
            }
        };

        fetchSeries();
    }, [seriesId]);

    const handleModalState = (isOpen: boolean) => {
        setIsModalOpen(isOpen);
    };

    const renderItem = ({ item }: { item: string }) => {
        if (loading) {
            return <ActivityIndicator size="large" color="#D8A84E50" />;
        }

        if (error) {
            return <Text>{error}</Text>;
        }

        switch (item) {
            case 'header':
                return <SeriesHeader key="header" image={seriesData?.poster_url} />;
            case 'details':
                return <SeriesDetails key="details" title={seriesData?.title} year={seriesData?.year} creator={seriesData?.creator} genres={seriesData?.genre} />;
            case 'bio':
                return <SeriesBio key="bio" bio={seriesData?.description} />;
            case 'alert':
                return seriesData?.ended === null ? <SeriesAlert key="alert" release={seriesData?.release_date} /> : null;
            case 'logButton':
                return <LogButton key="logButton" onModalToggle={handleModalState} navigation={undefined} type="series" disabled={!token}/>;
            case 'cast':
                return <SeriesCast key="cast" cast={seriesData?.cast} />;
            case 'seasons':
                return <SeriesSeasons key="seasons" seasons={seriesData?.total_seasons} seriesId={seriesData?.series_api_id} />;
            case 'reviews':
                return <ReviewsContainer key="reviews" reviews={seriesData?.reviews || []} type={'series'} seriesId={seriesId} ratings={seriesData?.ratings || []}/>;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            <FlatList
                data={['header', 'details', 'bio', 'alert', 'logButton', 'cast', 'seasons', 'reviews']}
                renderItem={renderItem}
                keyExtractor={(item) => item}
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
    flatListContent: {
        paddingBottom: 40, 
    },
});