import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';
import { findAllUsers } from '@/api/userApi';
import { searchShows } from '@/api/tvAPI';

import SearchBar from '@/components/search/SearchBar';
import FilterTabs from '@/components/FilterTabs';
import UsersDisplay from '@/components/users/UsersDisplay';
import EmptyState from '@/components/EmptyState';
import TabBar from '@/components/TabBar';

import type { User } from '@/components/users/UsersDisplay';
import type { Series } from '@/components/series/SeriesDisplay';
import SeriesDisplay from '@/components/series/SeriesDisplay';

type SearchResult = User | Series;

type Filter = {
    label: string;
    key: string | null;
};

type SearchShowsResponse = {
    shows: any[];
    error?: any;
};

export default function SearchScreen() {
    const router = useRouter();
    const { user, token } = useUserContext();
    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const filters: Filter[] = [
        { label: 'All', key: null },
        { label: 'Series', key: 'series' },
        { label: 'Users', key: 'user' },
    ];

    const handleSearchFocus = () => setIsFocused(true);
    const handleSearchBlur = () => setIsFocused(false);
    const handleSearchChange = (text: string) => setSearchText(text);
    const handleFilterChange = (filter: string | null) => setSelectedFilter(filter);

    useEffect(() => {
        const fetchData = async () => {
            if (searchText.trim().length < 3) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);

            try {
                let usersData: User[] = [];
                if (selectedFilter === 'user' || selectedFilter === null) {
                    usersData = await findAllUsers(searchText);
                    console.log('Users Data:', usersData);

                    if (!Array.isArray(usersData)) {
                        console.error('Error: usersData is not an array', usersData);
                        usersData = [];
                    }
                }

                let showsResponse: SearchShowsResponse = { shows: [] };
                if (selectedFilter === 'series' || selectedFilter === null) {
                    showsResponse = await searchShows(searchText);
                    console.log('Shows Response:', showsResponse);

                    if (showsResponse.error) {
                        console.error('Error fetching shows:', showsResponse.error);
                        showsResponse.shows = [];
                    }

                    if (!Array.isArray(showsResponse.shows)) {
                        console.error('Error: showsResponse.shows is not an array');
                        showsResponse.shows = [];
                    }
                }

                const formattedShows: Series[] = showsResponse.shows
                    .map((item: any) => {
                        if (!item.show) {
                            console.warn('Warning: Missing show object in', item);
                            return null;
                        }
                        const show = item.show;
                        console.log('teste: ', show);
                        
                        return {
                            series_api_id: show.id,
                            name: show.name,
                            image: show.image?.medium ?? '',
                            rating: show.rating?.average ?? 0,
                            language: show.language,
                            year: show.premiered && show.premiered.split('-')[0],
                            seasons: show.number_of_seasons ?? 0,
                            type: 'series',
                        };
                    })
                    .filter(Boolean) as Series[];

                const formattedUsers: User[] = usersData.map((user: any) => ({
                    user_id: user.user_id,
                    name: user.name,
                    avatar: user.avatar,
                    type: 'user',
                }));

                const combinedResults = [...formattedUsers, ...formattedShows];
                setSearchResults(combinedResults);
            } catch (err) {
                console.error('Error fetching data:', err);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchText, selectedFilter]);

    const handleItemPress = (item: SearchResult) => {
        if (item.type === 'user') {
            router.push(`/user/${item.user_id}` as any);
        } else if (item.type === 'series') {
            router.push(`/series/${item.series_api_id}` as any);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.suggestionsContainer}>
                <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} onChange={handleSearchChange} value={searchText} />

                {isFocused || searchText ? (
                    <>
                        <FilterTabs tabs={filters} onTabChange={handleFilterChange} allowNoneSelected={true} initialTab={null} />

                        {isLoading ? (
                            <ActivityIndicator size="large" color="#000" />
                        ) : searchResults.length === 0 ? (
                            <EmptyState type="404" />
                        ) : (
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item, index) => {
                                    if (item.type === 'user') {
                                        return item.user_id ? `user-${item.user_id}` : `user-${item.name}-${index}`;
                                    } else if (item.type === 'series') {
                                        return item.series_api_id ? `series-${item.series_api_id}` : `series-${item.name}-${index}`;
                                    }
                                    return `item-${index}`;
                                }}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.resultContainer}
                                        onPress={() => handleItemPress(item)}
                                    >
                                        {item.type === 'user' && <UsersDisplay users={[item]} currentUser={user?.user_id ?? -1} type="search" />}
                                        {item.type === 'series' && <SeriesDisplay series={[item]} type="default" userId={user?.user_id ?? -1} />}
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </>
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item, index) => {
                            if (item.type === 'user') {
                                return item.user_id ? `user-${item.user_id}` : `user-${item.name}-${index}`;
                            } else if (item.type === 'series') {
                                return item.series_api_id ? `series-${item.series_api_id}` : `series-${item.name}-${index}`;
                            }
                            return `item-${index}`;
                        }}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.resultContainer}
                                onPress={() => handleItemPress(item)}
                            >
                                {item.type === 'user' && <UsersDisplay users={[item]} currentUser={user?.user_id ?? -1} type="search" />}
                                {item.type === 'series' && <SeriesDisplay series={[item]} type="default" userId={user?.user_id ?? -1} />}
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
            <TabBar isLoggedIn={!!token} currentPage="Search" userId={user?.user_id || null} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    suggestionsContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingHorizontal: 16,
    },
    resultContainer: {
        marginTop: 4,
    },
});