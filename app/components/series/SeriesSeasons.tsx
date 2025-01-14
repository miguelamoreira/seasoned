import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useRouter } from 'expo-router';
import SeasonDisplay from '@/components/series/SeasonsDisplay';
import { getSeriesProgress } from '@/api/progressApi';

type Season = {
    id: number;
    number: number;
    episodeOrder: number;
};

type line = {
    series_id: number;
    user_id: number;
    progress_percentage: number;
};
export default function SeriesSeasons({ seasons, seriesId, userId }: { seasons: Season[]; seriesId: string, userId?: number | null}) {
    const router = useRouter();

    const [seriesProgressData, setseriesProgressData] = useState<any | null>(null);

    const seasonsData = seasons.map(season => ({
        id: season.id,
        number: season.number,
        episodeOrder: season.episodeOrder,
        onPress: () => router.push(`/series/${seriesId}/seasons/${season.id}`),
    }));

    useEffect(()=>{
        const fetchSeries = async (userId?: number | null) => {
            try {
                const data = await getSeriesProgress(userId);
                setseriesProgressData(data.find((line: line)=> line.series_id == parseInt(seriesId)))
            } catch (err) {
            }
        };
        fetchSeries(userId)
    }, [])

    
    const progress = seriesProgressData.progress_percentage / 100
    
    return (
        <View style={styles.seasonsContainer}>
            <Text style={styles.heading}>Seasons</Text>
            <Progress.Bar
                progress={progress}
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