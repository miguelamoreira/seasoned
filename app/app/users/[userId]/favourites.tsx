import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import SearchBar from '@/components/search/SearchBar';
import SeriesDisplay, { Series } from '@/components/series/SeriesDisplay';

import { searchShows } from '@/api/tvAPI';

export default function AddFavouritesScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Series[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
            setError(null);

            try {
                const result = await searchShows(searchText);
                if (result.shows) {
                    const formattedShows: Series[] = result.shows.map((show: any) => ({
                        id: show.show.id,
                        name: show.show.name,
                        image: show.show.image?.medium ?? '',
                        rating: show.show.rating?.average ?? 0,
                        language: show.show.language,
                    }));
                    setSearchResults(formattedShows);
                }
            } catch (err) {
                setError('Failed to fetch shows. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchShows();
    }, [searchText]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="cross-check" onCheckPress={() => router.back()} onCrossPress={() => router.back()} />

            <Text style={styles.heading}>Add favourite</Text>

            <View style={styles.searchContainer}>
                <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} onChange={handleSearchChange} value={searchText}/>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <View style={{ paddingHorizontal: 16 }}>
                    <SeriesDisplay series={searchResults} type="add" />
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
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
});