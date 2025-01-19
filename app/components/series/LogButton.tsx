import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { useUserContext } from '@/contexts/UserContext';
import { fetchWatchlist, addWatchlist, removeWatchlist } from '@/api/watchlistApi';
import { fetchLikedSeries, likeSeries, dislikeSeries } from '@/api/seriesLikesApi';
import { fetchLikedEpisodes, likeEpisodes, dislikeEpisodes } from '@/api/episodesLikesApi';
import { fetchFollowedSeries, addFollowedSeries, removeFollowedSeries } from '@/api/followedSeriesApi';
import { fetchDroppedSeries, addDroppedSeries, removeDroppedSeries } from '@/api/droppedSeriesApi';
import { createReviews, fetchReviewsByUserId } from '@/api/reviewsApi';
import { fetchBadgeById, addEarnedBadge } from '@/api/badgesApi';

type LogButtonProps = {
    onModalToggle: (isOpen: boolean) => void;
    navigation: any;
    type: 'episode' | 'series';
    disabled?: boolean
};

export default function LogButton({ onModalToggle, navigation, type, disabled }: LogButtonProps) {
    const { user, token } = useUserContext();
    const loggedInId = user?.user_id || null; 
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const router = useRouter();
    const { seriesId, seasonId, episodeId } = useLocalSearchParams<{ seriesId: string; seasonId: string; episodeId: string }>();

    const fetchStatus = useCallback(async () => {
        if (!loggedInId) return;
    
        try {
            if (type === 'series') {
                const [likedSeries, followedSeries, droppedSeries, watchlist, existingReviews] = await Promise.all([
                    fetchLikedSeries(loggedInId),
                    fetchFollowedSeries(loggedInId),
                    fetchDroppedSeries(loggedInId),
                    fetchWatchlist(loggedInId),
                    fetchReviewsByUserId(loggedInId),
                ]);

                setLiked(
                    likedSeries.some((item: any) => item.series_api_id === parseInt(seriesId))
                );
    
                const isSeriesFollowed = followedSeries.data.some(
                    (item: any) => item.series.series_api_id === parseInt(seriesId)
                );
    
                const isSeriesDropped = droppedSeries.data.some(
                    (item: any) => item.series.series_api_id === parseInt(seriesId)
                );
    
                if (isSeriesFollowed) {
                    setIsFollowed(true);
                } else if (isSeriesDropped) {
                    setIsFollowed(false);
                } else {
                    setIsFollowed(false);
                }
    
                setIsInWatchlist(
                    watchlist.data.some((item: any) => item.series.series_api_id === parseInt(seriesId))
                );
    
                const recentReview = existingReviews
                    .filter((review: any) =>
                        review.user_id === loggedInId &&
                        review.series_api_id === parseInt(seriesId) &&
                        review.score !== 0 &&
                        review.comment === '' &&
                        !review.episode_api_id
                    )
                    .sort((a: any, b: any) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime())[0];

                if (recentReview) {
                    setRating(recentReview.score);
                } else {
                    setRating(0);
                }
            } else if (type === 'episode') {
                const [likedEpisodesData, existingReviews] = await Promise.all([
                    fetchLikedEpisodes(loggedInId),
                    fetchReviewsByUserId(loggedInId),
                ]);           
    
                setLiked(
                    likedEpisodesData.some((item: any) => item.episode_api_id === parseInt(episodeId))
                );
    
                const recentEpisodeReview = existingReviews
                .filter((review: any) =>
                    review.user_id === loggedInId &&
                    review.series_api_id === parseInt(seriesId) &&
                    review.score !== 0 &&
                    review.comment === '' &&
                    review.episode_api_id === parseInt(episodeId) 
                )
                .sort((a: any, b: any) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime())[0];
                
                if (recentEpisodeReview) {
                    setRating(recentEpisodeReview.score);
                } else {
                    setRating(0);
                }
            }
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    }, [loggedInId, seriesId, episodeId, type]);
    
    useEffect(() => {
        if (modalVisible) fetchStatus();
    }, [modalVisible, fetchStatus]);    

    const handleRatingPress = async (index: number) => {
        const newRating = index + 1;
        setRating(newRating);
    
        const ratingData = {
            user_id: loggedInId,
            reviews: [
                {
                    series_api_id: parseInt(seriesId),
                    episode_api_id: type === 'episode' ? parseInt(episodeId) : undefined,
                    score: newRating,
                    comment: '',
                },
            ],
        };
    
        try {
            if (!loggedInId) return;
    
            if (type === 'episode') {
                const episodeReview = ratingData.reviews[0];
                if (episodeReview.episode_api_id) {
                    const response = await createReviews(ratingData.user_id, [episodeReview]);
                }
            } else if (type === 'series') {
                const response = await createReviews(ratingData.user_id, ratingData.reviews);

                const seriesReviews = await fetchReviewsByUserId(loggedInId)
                const totalSeriesReviewsWithFiveStars = seriesReviews.filter((rev: { episode_api_id: number; score: number; }) => !rev.episode_api_id && rev.score === 5).length;
                validateBadgeCriteria(totalSeriesReviewsWithFiveStars, 10, 9)

                const totalSeriesReviewsWithComments = seriesReviews.filter((rev: { episode_api_id: number; comment: string; }) => !rev.episode_api_id && rev.comment).length;
                validateBadgeCriteria(totalSeriesReviewsWithComments, 10, 1)
            }
        } catch (error) {
            console.error('Error creating/updating review:', error);
        }
    };    

    const toggleHeart = async () => {
        try {
            if (!loggedInId) {
                return;
            }
    
            const apiActions = {
                like: type === 'series' ? likeSeries : likeEpisodes,
                dislike: type === 'series' ? dislikeSeries : dislikeEpisodes,
            };
    
            if (liked) {
                await apiActions.dislike(loggedInId, seriesId, type === 'episode' ? episodeId : undefined);
            } else {
                await apiActions.like(loggedInId, seriesId, type === 'episode' ? episodeId : undefined);

                if (type === 'series') {
                    const likedSeriesCount = (await fetchLikedSeries(loggedInId)).length;
                    validateBadgeCriteria(likedSeriesCount, 10, 3)
                }
            }
    
            setLiked(!liked);
        } catch (error) {
            console.error('Error toggling like status:', error);
        }
    };    

    const toggleFollow = async () => {
        try {
            if (!loggedInId) {
                return;
            }

            if (isFollowed) {
                await removeFollowedSeries(loggedInId, seriesId);
                await addDroppedSeries(loggedInId, seriesId);
                const droppedSeriesCount = (await fetchDroppedSeries(loggedInId)).length;
                validateBadgeCriteria(droppedSeriesCount, 10, 11)
            } else {
                await removeDroppedSeries(loggedInId, seriesId);
                await addFollowedSeries(loggedInId, seriesId);
                const followedSeriesCount = (await fetchFollowedSeries(loggedInId)).length;
                validateBadgeCriteria(followedSeriesCount, 5, 13)
            }

            setIsFollowed(!isFollowed);
        } catch (error) {
            console.error('Error toggling follow status:', error);
        }
    };

    const toggleWatched = () => {
        setIsWatched(!isWatched);
    };

    const toggleWatchlist = async () => {
        try {
            if (!loggedInId) {
                return;
            }

            if (isInWatchlist) {
                await removeWatchlist(loggedInId, seriesId);
            } else {
                await addWatchlist(loggedInId, seriesId);
                const watchlistCount = (await fetchWatchlist(loggedInId)).length;
                validateBadgeCriteria(watchlistCount, 10, 14)
            }
            setIsInWatchlist(!isInWatchlist);
        } catch (error) {
            console.error('Error updating watchlist:', error);
        }
    };

    const validateBadgeCriteria = async (dataCount: number, num: number, badgeId: number) => {
        try {
            const badge = await fetchBadgeById(loggedInId, badgeId);
            if (!badge.earned) {
                if (dataCount >= num) {
                    addEarnedBadge(loggedInId, badgeId) 
                }
            }
        } catch (error) {
            console.error('Error validating badge criteria:', error);
        }
        
    }

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
            router.push(`/series/${seriesId}/seasons/${seasonId}/${episodeId}/log`);
        }
    };

    const renderEpisodeOptions = () => {
        return (
            <>
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
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]} style={{ width: windowWidth - 32 }}>
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
        width: windowWidth - 32,
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
