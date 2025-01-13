import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import SearchBar from '@/components/search/SearchBar';
import SeriesDisplay, { Series } from '@/components/series/SeriesDisplay';
import EmptyState from '@/components/EmptyState';

import { searchShows } from '@/api/tvAPI';
import { useUserContext } from '@/contexts/UserContext';

export default function AddFavouritesScreen() {
    const { user, token } = useUserContext();  
    const userId = user?.user_id ?? null;
    const router = useRouter();

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Series[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearchFocus = () => setIsFocused(true);
    const handleSearchBlur = () => setIsFocused(false);
    const handleSearchChange = (text: string) => setSearchText(text);

    useEffect(() => {
        if (searchText.trim().length < 3) {
            setSearchResults([]);
            return; 
        }

        const fetchShows = async () => {
            setIsLoading(true);

            try {
                const result = await searchShows(searchText);
                if (result.shows) {
                    const formattedShows: Series[] = result.shows.map((show: any) => ({
                        series_api_id: show.show.id,
                        name: show.show.name,
                        image: show.show.image?.medium ?? '',
                        rating: show.show.rating?.average ?? 0,
                        language: show.show.language,
                    }));
                    setSearchResults(formattedShows);
                } else {
                    setSearchResults([]);
                }
            } catch (err) {
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShows();
    }, [searchText]);

    const shouldShowEmptyState = searchText.trim().length > 0 && searchResults.length === 0;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="cross-check" onCheckPress={() => router.push(`/users/${userId}`)} onCrossPress={() => router.back()} />

            <Text style={styles.heading}>Add favourite</Text>

            <View style={styles.searchContainer}>
                <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} onChange={handleSearchChange} value={searchText}/>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : shouldShowEmptyState ? (
                <View>
                    <EmptyState type="404" />
                </View>
            ) : (
                <View style={{ paddingHorizontal: 16 }}>
                    <SeriesDisplay series={searchResults} type="add" userId={Number(userId)} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    searchContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
});