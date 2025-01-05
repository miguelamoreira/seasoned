import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import SeriesDisplay, { Series } from '@/components/series/SeriesDisplay';
import CoverDisplay from '@/components/series/Cover';
import OptionsTab from '@/components/OptionsTab';
import EmptyState from '@/components/EmptyState';
import Menu from '@/components/users/Menu';

import { fetchFollowedSeries } from '@/api/followedSeriesApi'
import { fetchWatchedSeries } from '@/api/watchedSeriesApi'
import { fetchWatchlist } from '@/api/watchlistApi'
import { fetchDroppedSeries } from '@/api/droppedSeriesApi'

const TABS: { label: string; icon: string; library: "FontAwesome" | "AntDesign" }[] = [
    { label: 'Following', icon: 'bookmark', library: 'FontAwesome' },
    { label: 'Watched', icon: 'eye', library: 'AntDesign' },
    { label: 'Watchlist', icon: 'clockcircle', library: 'AntDesign' },
    { label: 'Dropped', icon: 'bookmark-o', library: 'FontAwesome' },
];

const WATCHLIST_FILTERS = ['Released', 'Unreleased'] as const;
type WatchlistFilterType = (typeof WATCHLIST_FILTERS)[number];

export default function UsersShowsScreen() {
    const { userId, activeTab: initialActiveTab } = useLocalSearchParams<{ userId: string; activeTab: string }>();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'Following' | 'Watched' | 'Watchlist' | 'Dropped'>(
        (initialActiveTab as 'Following' | 'Watched' | 'Watchlist' | 'Dropped') || 'Following'
    );
    const [followedSeries, setFollowedSeries] = useState<Series[]>([]);
    const [watchedSeries, setWatchedSeries] = useState<Series[]>([]);
    const [watchlistSeries, setWatchlistSeries] = useState<Series[]>([]);
    const [droppedSeries, setDroppedSeries] = useState<Series[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const followed = await fetchFollowedSeries(userId);
                const formattedFollowed = followed.data.map((show: any) => ({
                    series_api_id: show.series.series_api_id,
                    name: show.series.title,
                    image: show.series.poster_url,
                    seasons: show.series.total_seasons,
                    creator: show.series.creator,
                    rating: show.series.average_rating ?? 0,
                }));
                setFollowedSeries(formattedFollowed);
    
                const watched = await fetchWatchedSeries(userId);
                const formattedWatched = watched.data.map((show: any) => ({
                    series_api_id: show.series.series_api_id,
                    name: show.series.title,
                    image: show.series.poster_url,
                    rating: show.rating?.average ?? 0,
                }));
                setWatchedSeries(formattedWatched);
    
                const watchlist = await fetchWatchlist(userId);
                const formattedWatchlist = watchlist.data.map((show: any) => ({
                    series_api_id: show.series.series_api_id,
                    name: show.series.title,
                    image: show.series.poster_url,
                    rating: show.rating?.average ?? 0,
                }));
                setWatchlistSeries(formattedWatchlist);
    
                const dropped = await fetchDroppedSeries(userId);
                const formattedDropped = dropped.data.map((show: any) => ({
                    series_api_id: show.series.series_api_id,
                    name: show.series.title,
                    image: show.series.poster_url,
                    seasons: show.series.total_seasons,
                    creator: show.series.creator,
                    rating: show.series.average_rating ?? 0,
                }));
                setDroppedSeries(formattedDropped);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, [userId]);    

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'Following' | 'Watched' | 'Watchlist' | 'Dropped');
    };

    const renderShows = () => {
        if (activeTab === 'Watchlist') {
            if (watchlistSeries.length === 0) {
                return <EmptyState type="emptyWatchlist" />;
            }
    
            const covers = watchlistSeries.map((show) => ({
                image: show.image,
                liked: false,
            }));
            return <CoverDisplay key="watchlist" covers={covers} type="default" />;
        }
    
        if (activeTab === 'Watched') {
            if (watchedSeries.length === 0) {
                return <EmptyState type="myActivity" />;
            }
    
            const covers = watchedSeries.map((show) => ({
                image: show.image,
                rating: show.rating,
            }));
            return <CoverDisplay key="watched" covers={covers} type="default" />;
        }
    
        if (activeTab === 'Dropped') {
            if (droppedSeries.length === 0) {
                return <EmptyState type="noDrops" />;
            }
    
            return <SeriesDisplay key="dropped" series={droppedSeries} type="default" userId={Number(userId)} />;
        }
    
        if (followedSeries.length === 0) {
            return <EmptyState type="noFollowingShows" />;
        }
    
        return <SeriesDisplay key="following" series={followedSeries} type="default" userId={Number(userId)} />;
    };    

    return (
        <SafeAreaView style={styles.container}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            <Menu tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />

            <View style={styles.seriesContainer}>
                {renderShows()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
        paddingBottom: 60,
    },
    seriesContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
});