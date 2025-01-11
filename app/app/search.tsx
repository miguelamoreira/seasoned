import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';

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

export default function SearchScreen() {
    const router = useRouter();
    const { user, token } = useUserContext();
    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const users: User[] = [
        { user_id: 1, avatar: 'https://via.placeholder.com/80x80', name: 'User1', following: true, type: 'user' },
        { user_id: 2, avatar: 'https://via.placeholder.com/80x80', name: 'User2', following: false, type: 'user' },
        { user_id: 3, avatar: 'https://via.placeholder.com/80x80', name: 'User3', following: false, type: 'user' },
    ];

    const shows: Series[] = [
        { series_api_id: 1, image: 'https://static.tvmaze.com/uploads/images/medium_portrait/211/528026.jpg', name: 'Mr. Robot', year: 2015, seasons: 4, creator: 'Sam Esmail', rating: 4.5, type: 'series' },
        { series_api_id: 2, image: 'https://via.placeholder.com/80x120', name: 'Show Two', year: 2024, seasons: 2, creator: 'Creator 2', rating: 3.2, date: '2024-06-01', type: 'series' },
    ];

    const filters: Filter[] = [
        { label: 'All', key: null },
        { label: 'Series', key: 'series' },
        { label: 'Users', key: 'user' },
    ];

    const searchResults: SearchResult[] = [...users, ...shows];

    const handleSearchFocus = () => setIsFocused(true);
    const handleSearchBlur = () => setIsFocused(false);
    const handleSearchChange = (text: string) => setSearchText(text);
    const handleFilterChange = (filter: string | null) => setSelectedFilter(filter);

    const filteredSearches = searchResults.filter((item) => {
        const matchesSearchText =
            item.name.toLowerCase().includes(searchText.toLowerCase());
        return selectedFilter ? matchesSearchText && item.type === selectedFilter : matchesSearchText;
    });

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

                        {filteredSearches.length === 0 ? (
                            <EmptyState type="404" />
                        ) : (
                            <FlatList
                                data={filteredSearches}
                                keyExtractor={(item) =>
                                    item.type === 'user' ? `user-${item.user_id}` : `series-${item.series_api_id}`
                                }
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
                        keyExtractor={(item) =>
                            item.type === 'user' ? `user-${item.user_id}` : `series-${item.series_api_id}`
                        }
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