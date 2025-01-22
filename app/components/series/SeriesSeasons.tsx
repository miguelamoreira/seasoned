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
    progress_percentage?: number | null;
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

    useEffect(() => {
        const fetchSeriesProgress = async () => {
            if (userId) {
                try {
                    const data = await getSeriesProgress(userId);
                    const progressData = data.find((line: line) => line.series_id === parseInt(seriesId, 10));
                    setseriesProgressData(progressData || null);
                } catch (err) {
                    console.error("Error fetching series progress: ", err);
                }
            }
        };
    
        fetchSeriesProgress();
    
        const intervalId = setInterval(fetchSeriesProgress, 1000);
    
        return () => clearInterval(intervalId);
    }, [userId, seriesId]);
    let progress = 0
    if(seriesProgressData != null){
    progress = seriesProgressData.progress_percentage / 100
    }
    
    return (
        <View style={styles.seasonsContainer}>
            <Text style={styles.heading}>Seasons</Text>
            <Progress.Bar
                progress={progress}
                width={null}
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