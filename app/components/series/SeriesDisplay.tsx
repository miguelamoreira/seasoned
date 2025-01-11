import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Shadow } from 'react-native-shadow-2';
import * as Progress from 'react-native-progress';

import { addFavouriteSeries, fetchFavouriteSeries, deleteFavouriteSeries } from '@/api/favouriteSeriesApi';

export type Series = {
    series_api_id: number;
    image: string;
    name: string;
    year: number;
    seasons?: number;
    creator?: string;
    language?: string;
    rating?: number;
    date?: string;
    progress?: number;
    type?: 'series';
};

type SeriesType = 'default' | 'progress' | 'unreleased' | 'add';

type SeriesProps = {
    series: Series[];
    type: SeriesType;
    userId: number;
};

export default function SeriesDisplay({ series, type, userId }: SeriesProps) {
    const [favouriteSeries, setFavouriteSeries] = useState<Series[]>([]);

    const fetchUserFavourites = async () => {
        try {
            const response = await fetchFavouriteSeries(userId);
            setFavouriteSeries(response.data);
        } catch (error) {
            console.error('Error fetching favourite series:', error);
        }
    };

    useEffect(() => {
        if (type === 'add') {
            fetchUserFavourites();
        }
    }, [type, userId]);

    const isSeriesFavourite = (seriesId: number) => {
        return favouriteSeries.some(favSeries => favSeries.series_api_id === seriesId);
    };

    const handleAddFavouriteSeries = async (seriesId: number) => {
        try {
            const response = await addFavouriteSeries(userId, seriesId);
            console.log('Successfully added to favourites:', response);

            fetchUserFavourites();
        } catch (error) {
            console.error('Failed to add favourite series:', error);
        }
    };

    const renderShow = ({ item }: { item: Series }) => (
        <>
            {type === 'default' && (
                <View style={styles.seriesContainer}>
                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                        <Image source={{ uri: item.image }} style={styles.seriesImage} />
                    </Shadow>
                    <View style={styles.seriesDetails}>
                        <Text style={styles.seriesTitle}>
                            {item.name} <Text style={styles.seriesYear}>{item.year}</Text>
                        </Text>
                        <View style={[styles.bottomRow, { marginTop: 80 }]}>
                            <Text style={styles.seriesCreator}>Language: <Text style={styles.seriesCreatorHighlight}>{item.language}</Text></Text>
                            <View style={styles.ratingContainer}>
                                {item.rating !== undefined && (
                                    <>
                                        <Text style={styles.seriesRating}>{item.rating.toFixed(1)}</Text>
                                        <AntDesign name="star" size={18} color="#D8A84E" />
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            )}
            {type === 'progress' && (
                <View style={styles.seriesContainer}> 
                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                        <Image source={{ uri: item.image }} style={styles.seriesImage} />
                    </Shadow>
                    <View style={styles.seriesDetails}>
                        <Text style={styles.seriesTitle}>
                            {item.name} <Text style={styles.seriesYear}>{item.year}</Text>
                        </Text>
                        <Text style={styles.seriesSeasons}>
                        {item.seasons !== undefined ? 
                            (item.seasons > 1 ? `${item.seasons} seasons` : `${item.seasons} season`) : 
                            '0 season'
                        }
                        </Text>
                        <View style={styles.followingRow}>
                            <Text style={styles.seriesCreator}>Created by <Text style={styles.seriesCreatorHighlight}>{item.creator}</Text></Text>
                            {item.progress !== undefined && (
                                <View style={styles.progressBarContainer}>
                                    <Progress.Bar 
                                        progress={item.progress / 100} 
                                        width={240} 
                                        color="#82AA59" 
                                        borderColor="#352A23" 
                                        unfilledColor="#352A23" 
                                    />
                                    <Text style={styles.progressText}>{`${Math.round(item.progress)}%`}</Text> 
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            )}
            {type === 'unreleased' && (
                <View style={styles.seriesContainer}> 
                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                        <Image source={{ uri: item.image }} style={styles.seriesImage} />
                    </Shadow>
                    <View style={styles.seriesDetails}>
                        <Text style={styles.seriesTitle}>
                            {item.name} <Text style={styles.seriesYear}>{item.year}</Text>
                        </Text>
                        <Text style={styles.seriesSeasons}>
                        {item.seasons !== undefined ? 
                            (item.seasons > 1 ? `${item.seasons} seasons` : `${item.seasons} season`) : 
                            '0 season'
                        }
                        </Text>
                        <View style={[styles.bottomRow, { marginTop: 56 }]}>
                            <Text style={styles.date}>{item.date}</Text>
                            <View style={styles.ratingContainer}>
                                <FontAwesome name="bookmark" size={20} color="#82AA59"></FontAwesome>
                            </View>
                        </View>
                    </View>
                </View>
            )}
            {type === 'add' && !isSeriesFavourite(item.series_api_id) && (
                <View style={styles.seriesContainer}>
                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                        <Image source={{ uri: item.image }} style={styles.seriesImage} />
                    </Shadow>
                    <View style={styles.seriesDetails}>
                        <Text style={styles.seriesTitle}>
                            {item.name} <Text style={styles.seriesYear}>{item.year}</Text>
                        </Text>
                        <View style={styles.middleRow}>
                            <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                                <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => handleAddFavouriteSeries(item.series_api_id)}>
                                    <AntDesign name="plus" size={18} style={{ padding: 4 }} />
                                </TouchableOpacity>
                            </Shadow>
                        </View>
                        <View style={[styles.bottomRow, { marginTop: 34 }]}>
                            <Text style={styles.seriesCreator}>Language: <Text style={styles.seriesCreatorHighlight}>{item.language}</Text></Text>
                            <View style={styles.ratingContainer}>
                                {item.rating !== undefined && (
                                    <>
                                        <Text style={styles.seriesRating}>{item.rating.toFixed(1)}</Text>
                                        <AntDesign name="star" size={18} color="#D8A84E" />
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            )}
            {type === 'add' && isSeriesFavourite(item.series_api_id) && (
                <View style={styles.seriesContainer}>
                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                        <Image source={{ uri: item.image }} style={styles.seriesImage} />
                    </Shadow>
                    <View style={styles.seriesDetails}>
                        <Text style={styles.seriesTitle}>
                            {item.name} <Text style={styles.seriesYear}>{item.year}</Text>
                        </Text>
                        <Text style={styles.seriesCreator}>This series is already in your favourites!</Text>
                    </View>
                </View>
            )}
        </>
    );

    return (
        <FlatList
            data={series}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={renderShow}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        marginBottom: 20,
        color: '#211B17',
        fontFamily: 'Arimo',
    },
    seriesContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        paddingVertical: 8,
    },
    seriesImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#211B17'
    },
    seriesDetails: {
        flex: 1,
        marginLeft: 16,
    },
    seriesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    seriesYear: {
        fontWeight: 'normal',
        fontSize: 14,
        color: '#211B1770',
    },
    seriesSeasons: {
        marginTop: 4,
        fontSize: 14,
        color: '#211B1770',
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    followingRow: {
        flexDirection: 'column',
        marginTop: 48,
    },
    seriesCreator: {
        fontSize: 12,
        color: '#211B1770',
        flex: 1,
    },
    date: {
        fontSize: 12,
        color: '#211B1770',
        flex: 1,
    },
    seriesCreatorHighlight: {
        color: '#211B17'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seriesRating: {
        fontSize: 14,
        marginRight: 4, 
    },
    progressBarContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    progressText: {
        marginLeft: 12, 
    },
    button: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#D8A84E',
        borderWidth: 2,
        borderColor: '#211B17',
        margin: 2,
    },
    middleRow: {
        justifyContent: 'flex-end',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});