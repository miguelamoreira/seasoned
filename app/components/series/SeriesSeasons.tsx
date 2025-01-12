import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useRouter } from 'expo-router';
import SeasonDisplay from '@/components/series/SeasonsDisplay';

type Season = {
    id: number;
    number: number;
    episodeOrder: number;
};

export default function SeriesSeasons({ seasons, seriesId }: { seasons: Season[]; seriesId: string }) {
    const router = useRouter();

    const totalSeasons = seasons.length;

    const seasonsData = seasons.map(season => ({
        id: season.id,
        number: season.number,
        episodeOrder: season.episodeOrder,
        onPress: () => router.push(`/series/${seriesId}/seasons/${season.id}`),
    }));

    return (
        <View style={styles.seasonsContainer}>
            <Text style={styles.heading}>Seasons</Text>
            <Progress.Bar
                progress={totalSeasons > 0 ? 1 : 0}
                width={378}
                color="#82AA59"
                borderColor="#352A23"
                unfilledColor="#352A23"
                style={{ marginTop: 12, marginBottom: 16 }}
            />
            <SeasonDisplay seasons={seasonsData} />
        </View>
    );
}

const styles = StyleSheet.create({
    seasonsContainer: { 
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    heading: { 
        fontSize: 20, 
        fontFamily: 'DMSerifText',
        color: '#211B17', 
    },
});