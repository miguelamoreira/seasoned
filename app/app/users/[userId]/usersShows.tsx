import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import SeriesDisplay, { Series } from '@/components/series/SeriesDisplay';
import CoverDisplay from '@/components/series/Cover';
import OptionsTab from '@/components/OptionsTab';
import EmptyState from '@/components/EmptyState';
import Menu from '@/components/users/Menu';
import FilterTabs from '@/components/FilterTabs';

const TABS: { label: string; icon: string; library: "FontAwesome" | "AntDesign" }[] = [
    { label: 'Following', icon: 'bookmark', library: 'FontAwesome' },
    { label: 'Watched', icon: 'eye', library: 'AntDesign' },
    { label: 'Watchlist', icon: 'clockcircle', library: 'AntDesign' },
    { label: 'Dropped', icon: 'bookmark-o', library: 'FontAwesome' },
];

const WATCHLIST_FILTERS = ['Released', 'Unreleased'] as const;
type WatchlistFilterType = (typeof WATCHLIST_FILTERS)[number];

const showsData: Record<string, Series[] | Record<WatchlistFilterType, Series[]>> = {
    Following: [
        {
            series_api_id: 1,
            name: 'You',
            image: 'https://static.tvmaze.com/uploads/images/medium_portrait/548/1371270.jpg',
            year: 2018,
            seasons: 4,
            progress: 50,
            creator: 'Greg Berlanti',
            rating: 8.2,
            type: 'series',
        },
    ],
    Watched: [
        {
            series_api_id: 2,
            name: 'Normal People',
            image: 'https://static.tvmaze.com/uploads/images/medium_portrait/249/623354.jpg',
            year: 2020,
            seasons: 1,
            creator: 'Lenny Abrahamson',
            rating: 9.0,
            type: 'series',
        },
        {
            series_api_id: 3,
            name: 'Breaking Bad',
            image: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253519.jpg',
            year: 2008,
            seasons: 5,
            creator: 'Vince Gilligan',
            rating: 9.5,
            type: 'series',
        },
    ],
    Watchlist: {
        Released: [
            {
                series_api_id: 7,
                name: 'My Brilliant Friend',
                image: 'https://static.tvmaze.com/uploads/images/medium_portrait/540/1350132.jpg',
                year: 2018,
                seasons: 2,
                creator: 'Saverio Costanzo',
                type: 'series',
            },
        ],
        Unreleased: [
            {
                series_api_id: 10,
                name: 'Yellowjackets',
                image: 'https://static.tvmaze.com/uploads/images/medium_portrait/449/1124396.jpg',
                year: 2025,
                seasons: 1,
                date: '14 February, 2025',
                type: 'series',
            },
        ],
    },
    Dropped: [
        {
            series_api_id: 4,
            name: 'The Walking Dead',
            image: 'https://static.tvmaze.com/uploads/images/medium_portrait/424/1061900.jpg',
            year: 2010,
            seasons: 11,
            creator: 'Frank Darabont',
            rating: 8.1,
            type: 'series',
            progress: 25,
        },
    ],
};

export default function UsersShowsScreen() {
    const { userId, activeTab: initialActiveTab } = useLocalSearchParams<{ userId: string; activeTab: string }>();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'Following' | 'Watched' | 'Watchlist' | 'Dropped'>(
        (initialActiveTab as 'Following' | 'Watched' | 'Watchlist' | 'Dropped') || 'Following'
    );
    const [watchlistFilter, setWatchlistFilter] = useState<WatchlistFilterType>('Released');

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'Following' | 'Watched' | 'Watchlist' | 'Dropped');
    };

    const renderShows = () => {
        if (activeTab === 'Watchlist') {
            const filteredShows = (showsData.Watchlist as Record<WatchlistFilterType, Series[]>)[watchlistFilter];
            if (filteredShows.length === 0) {
                return <EmptyState type="emptyWatchlist" />;
            }

            if (watchlistFilter === 'Released') {
                const covers = filteredShows.map((show) => ({
                    image: show.image,
                    liked: false,
                }));
                return <CoverDisplay covers={covers} type="default" />;
            }
            return <SeriesDisplay series={filteredShows} type="unreleased" userId={Number(userId)} />;
        }

        if (activeTab === 'Watched') {
            const watchedShows = showsData.Watched as Series[];
            if (watchedShows.length === 0) {
                return <EmptyState type="myActivity" />;
            }

            const covers = watchedShows.map((show) => ({
                image: show.image,
                rating: show.rating,
            }));
            return <CoverDisplay covers={covers} type="rating" />;
        }

        if (activeTab === 'Dropped') {
            const droppedShows = showsData.Dropped as Series[];
            if (droppedShows.length === 0) {
                return <EmptyState type="noDrops" />;
            }

            return <SeriesDisplay series={droppedShows} type="progress" userId={Number(userId)} />;
        }

        const shows = showsData[activeTab] as Series[];
        if (shows.length === 0) {
            return <EmptyState type="noFollowingShows" />;
        }

        const showType = activeTab === 'Following' ? 'progress' : 'default';
        return <SeriesDisplay series={shows} type={showType} userId={Number(userId)} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            <Menu tabs={TABS} activeTab={activeTab} onTabPress={handleTabPress} />

            {activeTab === 'Watchlist' && (
                <FilterTabs
                    tabs={WATCHLIST_FILTERS.map((filter) => ({ label: filter, key: filter }))}
                    onTabChange={(key) => setWatchlistFilter(key as WatchlistFilterType)}
                    initialTab="Released"
                />
            )}

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