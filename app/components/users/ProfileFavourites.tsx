import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {Shadow} from 'react-native-shadow-2'; 
import { FontAwesome } from '@expo/vector-icons';

type Show = {
    id: string;
    image: string;
};

type ProfileFavouritesProps = {
    shows: Show[];
    type: 'profile' | 'edit';
    onAddShow?: () => void;
    onRemoveShow?: (id: string) => void;
};

export default function ProfileFavourites({ shows, type, onAddShow, onRemoveShow }: ProfileFavouritesProps) {
    const displayShows = type === 'edit'
        ? [...shows.slice(0, 2), { id: 'add-new', image: '' }]
        : shows.slice(0, 3);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Favourite shows</Text>
            <View style={styles.favouritesContainer}>
                {displayShows.map((item) => {
                    if (item.id === 'add-new' && type === 'edit') {
                        return (
                            <Shadow key={item.id} distance={2} startColor={'#211B17'} offset={[2, 4]}>
                                <TouchableOpacity style={styles.addNewItem} onPress={onAddShow}>
                                    <FontAwesome name="plus" size={48} color="#6A4A36" />
                                </TouchableOpacity>
                            </Shadow>
                        );
                    }

                    return (
                        <Shadow key={item.id} distance={2} startColor={'#211B17'} offset={[2, 4]}>
                            <View style={styles.showItem}>
                                <Image style={styles.showImage} source={{ uri: item.image }} />
                                {type === 'edit' && (
                                    <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveShow?.(item.id)}>
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
    removeIcon: {
        color: '#6A4A36',
        fontSize: 48,
        fontWeight: 'bold',
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
    addIcon: {
        fontSize: 48,
        color: '#6A4A36',
    },
});
