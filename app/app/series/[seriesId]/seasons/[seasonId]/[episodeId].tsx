import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import EpisodesHeader from '@/components/episodes/EpisodesHeader';
import EpisodesDetails from '@/components/episodes/EpisodesDetails';
import LogButton from '@/components/series/LogButton';
import ReviewsContainer from '@/components/series/ReviewsContainer';
import { FlatList } from 'react-native';

import { findEpisodeById } from '@/api/episodesApi'

export default function EpisodeScreen() {
    const { seriesId, seasonId, episodeId } = useLocalSearchParams<{ seriesId: string; seasonId: string; episodeId: string }>();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [episodeData, setEpisodeData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seriesName, setSeriesName] = useState('');

    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                const data = await findEpisodeById(episodeId);
                setEpisodeData(data);

                const showResponse = await fetch(`https://api.tvmaze.com/shows/${seriesId}`);
                const showData = await showResponse.json();
                setSeriesName(showData.name);

                setLoading(false);
            } catch (err) {
                setError('Failed to load episode data');
                setLoading(false);
            }
        };

        fetchEpisode();
    }, [episodeId, seriesId]);

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
            case 'optionsTab':
                return <OptionsTab type="back" onBackPress={() => router.back()} />;
            case 'heading':
                return <Text style={styles.heading}>Episode {episodeData?.episode} ({seriesName})</Text>;
            case 'header':
                return <EpisodesHeader image={episodeData?.image} />;
            case 'details':
                return <EpisodesDetails title={episodeData?.title} date={episodeData?.airdate} bio={episodeData?.description} />;
            case 'logButton':
                return <LogButton onModalToggle={handleModalState} navigation={undefined} type="episode" />;
            case 'reviews':
                return (
                    <ReviewsContainer
                        reviews={episodeData?.reviews || []}
                        type="episode"
                        seriesId={seriesId}
                        seasonNumber={seasonId}
                        episodeNumber={episodeId}
                        ratings={episodeData?.ratings || []}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <FlatList
                data={['optionsTab', 'heading', 'header', 'details', 'logButton', 'reviews']}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
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
        color: '#211B17',
        paddingHorizontal: 16,
    },
    flatListContent: {
        paddingBottom: 60,
    },
});