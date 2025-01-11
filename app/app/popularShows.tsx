import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import SeriesDisplay from '@/components/series/SeriesDisplay';

import { fetchPopularSeries } from '@/api/seriesLikesApi';

const shows = [
    {
        series_api_id: 1,
        image: 'https://static.tvmaze.com/uploads/images/medium_portrait/249/623354.jpg',
        title: 'Normal People',
        year: 2020,
        seasons: 1,
        creator: 'Lenny Abrahamson',
        rating: 4.2,
    },
    {
        series_api_id: 2,
        image: 'https://static.tvmaze.com/uploads/images/medium_portrait/211/528026.jpg',
        title: 'Mr. Robot',
        year: 2015,
        seasons: 4,
        creator: 'Sam Esmail',
        rating: 3.5,
    },
    {
        series_api_id: 3,
        image: 'https://static.tvmaze.com/uploads/images/medium_portrait/499/1247570.jpg',
        title: 'Gossip Girl',
        year: 2007,
        seasons: 6,
        creator: 'Amy Sherman-Palladino',
        rating: 2.5,
    },
    {
        series_api_id: 4,
        image: 'https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg',
        title: 'Game of Thrones',
        year: 2011,
        seasons: 8,
        creator: 'David Benioff and D.B. Weiss',
        rating: 5.0,
    },
    {
        series_api_id: 5,
        image: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253515.jpg',
        title: 'Better Call Saul',
        year: 2015,
        seasons: 6,
        creator: 'Vince Gilligan and Peter Gould',
        rating: 4.5,
    },
];

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

                console.log('teste: ', formattedSeries);
            
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
