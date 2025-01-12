import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';

import OptionsTab from '@/components/OptionsTab';
import EpisodesDisplay from '@/components/episodes/EpisodesDisplay';

const calculateProgress = (data: any[], conditionFn: (episode: any) => boolean): number => {
    const completed = data.filter(conditionFn).length;
    return data.length > 0 ? completed / data.length : 0;
};

export default function SeasonScreen() {
    const { seriesId, seasonId } = useLocalSearchParams<{ seriesId: string; seasonId: string }>();
    const router = useRouter();

    const [seasonProgress, setSeasonProgress] = useState(0);
    const [episodes, setEpisodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [seriesName, setSeriesName] = useState('');
    const [seasonNumber, setSeasonNumber] = useState(0);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const response = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
                const data = await response.json();
                
                setEpisodes(
                    data.map((episode: any) => ({
                        id: episode.id,
                        image: episode.image ? episode.image.medium : 'https://via.placeholder.com/100',
                        title: episode.name,
                        year: new Date(episode.airdate).getFullYear(),
                        season: episode.season,
                        episode: episode.number,
                        rating: episode.rating.average || null,
                        watched: false,
                        date: episode.airdate,
                    }))
                );

                const seasonDetailsResponse = await fetch(`https://api.tvmaze.com/seasons/${seasonId}`);
                const seasonDetailsData = await seasonDetailsResponse.json();
                setSeasonNumber(seasonDetailsData.number);

                const showResponse = await fetch(`https://api.tvmaze.com/shows/${seriesId}`);
                const showData = await showResponse.json();
                setSeriesName(showData.name);

                const progress = calculateProgress(data, (episode) => episode.rating.average !== null);
                setSeasonProgress(progress);
            } catch (error) {
                console.error('Error fetching episodes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEpisodes();
    }, [seasonId]);

    return (
        <SafeAreaView style={styles.container}>
            <OptionsTab type="back" onBackPress={() => router.back()} />

            <View style={styles.contentContainer}>
                <Text style={styles.heading}>Season {seasonNumber} ({seriesName})</Text>
                <Progress.Bar
                    progress={seasonProgress}
                    width={null}
                    height={8}
                    color="#82AA59"
                    borderColor="#352A23"
                    unfilledColor="#352A23"
                    style={styles.progressBar}
                />

                {isLoading ? (
                    <ActivityIndicator size="large" color="#82AA59" style={styles.loader} />
                ) : (
                    <EpisodesDisplay episodes={episodes} type="series" seriesId={seriesId} seasonNumber={seasonId} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingVertical: 42,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
        color: '#211B17',
    },
    progressBar: {
        marginTop: 8,
    },
    loader: {
        marginTop: 16,
    },
});