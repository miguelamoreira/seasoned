import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import SeriesDisplay from '@/components/series/SeriesDisplay';

import { fetchPopularSeries } from '@/api/seriesLikesApi';

export default function PopularShowsScreen() {
    const router = useRouter();
    const [popularShows, setPopularShows] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPopularSeries();

            if (data?.length > 0) {
                const formattedSeries = data.map((show: any) => ({
                    series_api_id: show.series_api_id,
                    name: show.title,
                    image: show.poster_url,
                    seasons: show.total_seasons,
                    creator: show.creator,
                    rating: show.average_rating ?? 0,
                }));
            
                setPopularShows(formattedSeries);
            }
        }

        fetchData()
    }, [])

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            <View style={styles.contentContainer}>
                <Text style={styles.heading}>Popular shows</Text>
                <SeriesDisplay series={popularShows} type='default' userId={3}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
        marginBottom: 16,
    },
});
