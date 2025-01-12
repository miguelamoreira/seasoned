import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';

import OptionsTab from '@/components/OptionsTab';
import EpisodesDisplay from '@/components/episodes/EpisodesDisplay';

export default function SeasonScreen() {
    const { seriesId, seasonNumber } = useLocalSearchParams<{ seriesId: string; seasonNumber: string }>();
    const router = useRouter();

    const seasonTitle = `Season ${seasonNumber} (Mr. Robot)`;
    const seasonProgress = 0.7; 
    const episodes = [
        { id: 1, image: 'https://via.placeholder.com/100', title: 'Episode 1', year: 2015, season: 1, episode: 1, rating: 4.3, watched: true },
        { id: 2, image: 'https://via.placeholder.com/100', title: 'Episode 2', year: 2015, season: 1, episode: 2, rating: 4.1, watched: true },
        { id: 3, image: 'https://via.placeholder.com/100', title: 'Episode 3', year: 2015, season: 1, episode: 3, rating: 4.0, watched: true },
        { id: 4, image: 'https://via.placeholder.com/100', title: 'Episode 4', year: 2015, season: 1, episode: 4, rating: 5.0, watched: true },
        { id: 5, image: 'https://via.placeholder.com/100', title: 'Episode 5', year: 2015, season: 1, episode: 5, rating: 3.4, watched: false },
        { id: 6, image: 'https://via.placeholder.com/100', title: 'Episode 6', year: 2015, season: 1, episode: 6, rating: 3.5, watched: false },
        { id: 7, image: 'https://via.placeholder.com/100', title: 'Episode 7', year: 2015, season: 1, episode: 7, rating: 4.1, watched: false },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <OptionsTab type="back" onBackPress={() => router.back()}/>
            <Text style={styles.heading}>{seasonTitle}</Text>
            <Progress.Bar
                progress={seasonProgress}
                width={null}
                height={8}
                color="#82AA59"
                borderColor="#352A23"
                unfilledColor="#352A23"
                style={styles.progressBar}
            />
            <EpisodesDisplay episodes={episodes} type="series" seriesId={seriesId} seasonNumber={seasonNumber} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingHorizontal: 16,
        paddingVertical: 42,
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
});
