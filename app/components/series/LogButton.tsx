import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

type LogButtonProps = {
    onModalToggle: (isOpen: boolean) => void;
    navigation: any;
    type: 'episode' | 'series';
    disabled?: boolean
};

export default function LogButton({ onModalToggle, navigation, type, disabled }: LogButtonProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const router = useRouter();
    const { seriesId, seasonNumber, episodeNumber } = useLocalSearchParams<{ seriesId: string; seasonNumber: string; episodeNumber: string }>();

    const handleRatingPress = (index: number) => {
        setRating(index + 1);
    };

    const toggleHeart = () => {
        setLiked(!liked);
    };

    const toggleFollow = () => {
        setIsFollowed(!isFollowed);
    };

    const toggleWatched = () => {
        setIsWatched(!isWatched);
    };

    const toggleWatchlist = () => {
        setIsInWatchlist(!isInWatchlist);
    };

    const openModal = () => {
        setModalVisible(true);
        onModalToggle(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        onModalToggle(false);
    };

    const goToLogReview = () => {
        closeModal();
        if (type === 'series') {
            router.push(`/series/${seriesId}/log`);
        } else if (type === 'episode') {
            router.push(`/series/${seriesId}/seasons/${seasonNumber}/${episodeNumber}/log`);
        }
    };

    const renderEpisodeOptions = () => {
        return (
            <>
                <TouchableOpacity onPress={toggleWatched} style={styles.optionRow}>
                    <FontAwesome
                        name={isWatched ? 'eye' : 'eye-slash'}
                        size={24}
                        color="#82AA59"
                    />
                    <Text style={styles.optionText}>{isWatched ? 'Unwatch' : 'Watched'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToLogReview} style={styles.optionRow}>
                    <MaterialIcons name="rate-review" size={24} color="#82AA59" />
                    <Text style={styles.optionText}>Log / Review</Text>
                </TouchableOpacity>
            </>
        );
    };

    const renderSeriesOptions = () => {
        return (
            <>
                <TouchableOpacity onPress={toggleFollow} style={styles.optionRow}>
                    <FontAwesome
                        name={isFollowed ? 'bookmark' : 'bookmark-o'}
                        size={24}
                        color="#82AA59"
                    />
                    <Text style={styles.optionText}>{isFollowed ? 'Unfollow show' : 'Follow show'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleWatched} style={styles.optionRow}>
                    <FontAwesome
                        name={isWatched ? 'eye-slash' : 'eye'}
                        size={24}
                        color="#82AA59"
                    />
                    <Text style={styles.optionText}>{isWatched ? 'Unwatch' : 'Watched'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToLogReview} style={styles.optionRow}>
                    <MaterialIcons name="rate-review" size={24} color="#82AA59" />
                    <Text style={styles.optionText}>Log / Review</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleWatchlist} style={styles.optionRow}>
                    <AntDesign
                        name={isInWatchlist ? 'clockcircle' : 'clockcircleo'}
                        size={24}
                        color="#82AA59"
                    />
                    <Text style={styles.optionText}>
                        {isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    </Text>
                </TouchableOpacity>
            </>
        );
    };

    return (
        <View>
            <View style={{ marginBottom: 20, paddingHorizontal: 16 }}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]} style={{ width: 378 }}>
                    <TouchableOpacity style={styles.button} onPress={openModal} activeOpacity={0.9} disabled={disabled}>
                        <Text style={styles.buttonText}>Log, rate, review, and more</Text>
                        <AntDesign name="down" size={24} color="#FFF4E0"></AntDesign>
                    </TouchableOpacity>
                </Shadow>
            </View>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal} statusBarTranslucent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={closeModal}>
                                <AntDesign name="up" size={24} color="#FFF4E0" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ratingRow}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.starsTitle}>Rating</Text>
                                <View style={styles.starsContainer}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <TouchableOpacity key={index} onPress={() => handleRatingPress(index)}>
                                            <AntDesign
                                                name="star"
                                                size={28}
                                                color={index < rating ? '#D8A84E' : '#D8A84E70'}
                                                style={{ marginHorizontal: 4 }}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity onPress={toggleHeart} style={styles.heartContainer}>
                                <AntDesign
                                    name={liked ? 'heart' : 'heart'}
                                    size={48}
                                    color={liked ? '#EE6363' : '#EE636370'}
                                />
                            </TouchableOpacity>
                        </View>

                        {type === 'episode' ? renderEpisodeOptions() : renderSeriesOptions()}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#604D42',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#211B17',
        width: 378,
    },
    buttonText: {
        color: '#F5E0CE',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#211B1750',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#403127',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        paddingTop: 16,
    },
    starsTitle: {
        fontSize: 18,
        color: '#FFF4E0',
        fontWeight: 'bold',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    ratingContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    heartContainer: {
        marginLeft: 16, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingVertical: 8,
    },
    optionText: {
        marginLeft: 12,
        color: '#FFF4E0',
        fontSize: 20,
    },
});
