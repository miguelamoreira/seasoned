import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { FontAwesome } from '@expo/vector-icons';

import { deleteFavouriteSeries } from '@/api/favouriteSeriesApi';

type Series = {
    series_api_id: number;
    title: string;
    poster_url: string;
};

type ProfileFavouritesProps = {
    shows: { series: Series }[];
    type: 'profile' | 'edit';
    onAddShow?: () => void;
    onRemoveShow?: (id: number) => void;
    userId: number;
};

export default function ProfileFavourites({ shows, type, onAddShow, onRemoveShow, userId }: ProfileFavouritesProps) {
    const displayShows = type === 'edit' 
        ? [ ...shows, ...new Array(3 - shows.length).fill({ series: { series_api_id: -1, title: 'Add New', poster_url: '' }}),]
        : [ ...shows, ...new Array(3 - shows.length).fill({ series: { series_api_id: -1, title: 'Add New', poster_url: '' }}) ];

    const handleRemoveShow = async (seriesId: number) => {
        try {
            await deleteFavouriteSeries(userId, seriesId);
            console.log('Favourite show removed successfully');

            if (onRemoveShow) {
                onRemoveShow(seriesId);
            }
        } catch (error) {
            console.log('Failed to remove favourite show: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Favourite shows</Text>
            <View style={styles.favouritesContainer}>
                {displayShows.map((item, index) => {
                    if (item.series.series_api_id === -1) {
                        return (
                            <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]}>
                                <View style={type === 'profile' ? styles.placeholderItem : styles.addNewItem}>
                                    {type === 'edit' && (
                                        <TouchableOpacity style={styles.addNewItemButton} onPress={onAddShow}>
                                            <FontAwesome name="plus" size={48} color="#6A4A36" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </Shadow>
                        );
                    }

                    return (
                        <Shadow key={item.series.series_api_id} distance={2} startColor={'#211B17'} offset={[2, 4]}>
                            <View style={styles.showItem}>
                                <Image style={styles.showImage} source={{ uri: item.series.poster_url }} />
                                {type === 'edit' && (
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemoveShow(item.series.series_api_id)}
                                    >
                                        <FontAwesome name="close" size={48} color="#6A4A36" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Shadow>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    heading: {
        fontSize: 20,
        fontFamily: 'DMSerifText',
        lineHeight: 30,
    },
    favouritesContainer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    showItem: {
        width: 100,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ECECEC',
        borderRadius: 8,
        borderColor: '#211B17',
        borderWidth: 2,
    },
    showImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addNewItem: {
        width: 100,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5E0CE',
        borderRadius: 8,
        borderColor: '#211B17',
        borderWidth: 2,
    },
    addNewItemButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderItem: {
        width: 100,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5E0CE',
        borderRadius: 8,
        borderColor: '#211B17',
        borderWidth: 2,
    },
});