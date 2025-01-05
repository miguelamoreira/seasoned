import React, { useState } from 'react';
import { Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Cover = {
    image: string;
    liked?: boolean;
    rating?: number; 
};

type CoverDisplayProps = {
    covers: Cover[];
    onCoverPress?: (cover: Cover) => void;
    type?: 'default' | 'liked' | 'rating';
};

const SCREEN_WIDTH = Dimensions.get('window').width - 32;
const COVER_SIZE = SCREEN_WIDTH / 4.5;
const COVER_MARGIN = (SCREEN_WIDTH - COVER_SIZE * 4) / 4.5;

export default function CoverDisplay({ covers, onCoverPress, type = 'default' }: CoverDisplayProps) {
    const [coverData, setCoverData] = useState(covers);

    const toggleLike = (index: number) => {
        const updatedCovers = [...coverData];
        updatedCovers[index].liked = !updatedCovers[index].liked;
        setCoverData(updatedCovers);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <AntDesign
                    key={i}
                    name={i <= rating ? 'star' : 'staro'}
                    size={14}
                    color="#D8A84E"
                    style={{ marginHorizontal: 1 }} 
                />
            );
        }
        return stars;
    };

    const renderCover = ({ item, index }: { item: Cover; index: number }) => (
        <TouchableOpacity onPress={() => onCoverPress?.(item)} style={[styles.coverContainer, type === 'liked' ? styles.likedCover : null]}>
            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <Image source={{ uri: item.image }} style={styles.coverImage} />
            </Shadow>

            <View style={styles.infoContainer}>
                {type === 'liked' && (
                    <TouchableOpacity onPress={() => toggleLike(index)} style={styles.likeButtonContainer}>
                        <AntDesign
                            name={item.liked ? 'heart' : 'hearto'}
                            size={18}
                            color={item.liked ? '#EE6363' : '#EE636350'}
                        />
                    </TouchableOpacity>
                )}

                {type === 'rating' && item.rating !== undefined && (
                    <View style={styles.starsContainer}>
                        {renderStars(item.rating)}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={coverData}
            renderItem={renderCover}
            keyExtractor={(item, index) => `${item.image}-${index}`}
            numColumns={4}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
        />
    );
}

const styles = StyleSheet.create({
    coverContainer: {
        marginHorizontal: COVER_MARGIN / 2,
        marginVertical: 8,
        alignItems: 'center',
    },
    likedCover: {
        marginVertical: 16,
    },
    coverImage: {
        width: COVER_SIZE,
        height: COVER_SIZE * 1.5,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#211B17',
    },
    infoContainer: {
        marginTop: 4,
        alignItems: 'center',
    },
    likeButtonContainer: {
        position: 'absolute',
        left: 20,
        top: 2,
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 2,
    },
    row: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    listContent: {
        paddingHorizontal: 0,
    },
});
