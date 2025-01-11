import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Touchable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/Ionicons';
import Star from 'react-native-vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { likeReview, dislikeReview } from '@/api/reviewLikesApi';

type Review = {
    user_id?: number | undefined;
    id: number;
    image?: string;
    title?: string;
    year?: number;
    review?: string;
    likes: number;
    comments?: number;
    username?: string;
    avatar?: string;
    liked?: boolean;
    rating?: number;
};

type ReviewsProps = {
    reviews: Review[];
    type: 'own' | 'notOwn' | 'all' | 'comment' | 'notifications';
    page?: 'series' | 'episode' | 'profile';
    seriesId?: string;
    seasonNumber?: string;
    episodeNumber?: string;
    userId?: number; 
};

export default function ReviewsDisplay({ reviews, type, page, seriesId, seasonNumber, episodeNumber, userId }: ReviewsProps) {
    const [popularReviews, setPopularReviews] = useState(reviews);
    const router = useRouter();
    const [loggedInId, setLoggedInId] = useState<number | null>(null);

    useEffect(() => {
        setPopularReviews(reviews)
    }, [reviews])

    useEffect(() => {
        const fetchLoggedInId = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                setLoggedInId(id ? parseInt(id, 10) : null);
            } catch (error) {
                console.error('Error fetching logged-in user ID:', error);
            }
        };

        fetchLoggedInId();
    }, []);

    const toggleLikedReviews = async (index: number) => {
        if (loggedInId === null) {
            console.warn('User must be logged in to like or dislike reviews.');
            return;
        }
    
        const updatedReviews = [...popularReviews];
        const targetReview = updatedReviews[index];
    
        if (page === 'profile' && loggedInId !== targetReview.user_id) {
            console.warn('Cannot remove likes on the profile page of another user.');
            return;
        }
    
        try {
            if (targetReview.liked) {
                await dislikeReview(loggedInId, targetReview.id);
                targetReview.likes = (targetReview.likes ?? 0) - 1;
    
                if (loggedInId === targetReview.user_id) {
                    const updatedReviewsWithoutDisliked = updatedReviews.filter(
                        (review) => review.id !== targetReview.id
                    );
                    setPopularReviews(updatedReviewsWithoutDisliked);
                    return;
                }
            } else {
                await likeReview(loggedInId, targetReview.id);
                targetReview.likes = (targetReview.likes ?? 0) + 1;
            }
    
            targetReview.liked = !targetReview.liked;
            setPopularReviews(updatedReviews);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const goToReviewDetails = (reviewId: number) => {
        if (page === 'episode') {
            router.push(`/series/${seriesId}/seasons/${seasonNumber}/${episodeNumber}/reviews/${reviewId}`);
        } else {
            router.push(`/series/${seriesId}/reviews/${reviewId}`);
        }
      };    

    return (
        <View style={styles.popularContainer}>
            { type === 'own' && (
                popularReviews.map((review, index) => (
                    <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]} style={popularReviews.length > 1 && { marginBottom: 20 }}>
                        <View style={[ styles.reviewCard, popularReviews.length > 1 && { marginBottom: 2 }]}>
                            <View style={styles.topRow}>
                                <View style={styles.leftSection}>
                                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                                        <Image source={{ uri: review.image }} style={styles.reviewImage}/>
                                    </Shadow>
                                </View>
                                <View style={styles.rightSection}>
                                    <View style={styles.reviewSeries}>
                                        <Text style={styles.reviewSeriesTitle}>{review.title}</Text>
                                        <Text style={styles.reviewSeriesYear}>{review.year}</Text>
                                    </View>
                                    <View style={styles.stars}>
                                        {Array.from({ length: 5 }, (_, idx) => (
                                            <Star key={idx} name={idx < (review.rating || 0) ? 'star' : 'staro'} size={18} color="#D8A84E" />
                                        ))}
                                    </View>
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                </View>
                            </View>
                            <View style={[styles.bottomRow, { justifyContent: 'flex-end' }]}>
                                <View style={styles.statsRow}>
                                    <View style={styles.likeContainer}>
                                        <Text style={styles.reviewStats}>{review.likes}</Text>
                                        <View>
                                            <Icon
                                                name={review.liked ? 'heart' : 'heart-outline'}
                                                size={18}
                                                color={review.liked ? '#EE6363' : '#211B17'}
                                                style={styles.icon}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.commentContainer}>
                                        <Text style={styles.reviewStats}>{review.comments}</Text>
                                        <Icon name="chatbubble-outline" size={18} color="#211B17" style={styles.icon}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Shadow>
                ))
            )}
            { type === 'notOwn' && (
                popularReviews.map((review, index) => (
                    <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]} style={popularReviews.length > 1 && { marginBottom: 20 }}>
                        <View style={[ styles.reviewCard, popularReviews.length > 1 && { marginBottom: 2 }]}>
                            <View style={styles.topRow}>
                                <View style={styles.leftSection}>
                                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                                        <Image source={{ uri: review.image }} style={styles.reviewImage}/>
                                    </Shadow>
                                </View>
                                <View style={styles.rightSection}>
                                    <View style={styles.reviewSeries}>
                                        <Text style={styles.reviewSeriesTitle}>{review.title}</Text>
                                        <Text style={styles.reviewSeriesYear}>{review.year}</Text>
                                    </View>
                                    <View style={styles.stars}>
                                        {Array.from({ length: 5 }, (_, idx) => (
                                            <Star key={idx} name={idx < (review.rating || 0) ? 'star' : 'staro'} size={18} color="#D8A84E" />
                                        ))}
                                    </View>
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                </View>
                            </View>
                            <View style={styles.bottomRow}>
                                <View style={styles.userRow}>
                                    <Image source={{ uri: review.avatar }} style={styles.avatar} />
                                    <Text style={styles.username}>{review.username}</Text>
                                </View>
                                <View style={[styles.statsRow, { justifyContent: 'flex-end' }]}>
                                    <View style={styles.likeContainer}>
                                        <Text style={styles.reviewStats}>{review.likes}</Text>
                                        <TouchableOpacity onPress={() => toggleLikedReviews(index)}>
                                            <Icon
                                                name={review.liked ? 'heart' : 'heart-outline'}
                                                size={18}
                                                color={review.liked ? '#EE6363' : '#211B17'}
                                                style={styles.icon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.commentContainer}>
                                        <Text style={styles.reviewStats}>{review.comments}</Text>
                                        <Icon name="chatbubble-outline" size={18} color="#211B17" style={styles.icon}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Shadow>
                ))
            )}
            { type === 'all' && (
                popularReviews.map((review, index) => (
                    <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]} style={popularReviews.length > 1 && { marginBottom: 20 }}>
                        <TouchableOpacity style={[ styles.reviewCard, popularReviews.length > 1 && { marginBottom: 2 }]} activeOpacity={0.9} onPress={() => goToReviewDetails(review.id)}>
                            <View style={styles.topRow}>
                                <View style={{ paddingHorizontal: 8 }}>
                                    <View style={styles.stars}>
                                        {Array.from({ length: 5 }, (_, idx) => (
                                            <Star key={idx} name={idx < (review.rating || 0) ? 'star' : 'staro'} size={18} color="#D8A84E" />
                                        ))}
                                    </View>
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                </View>
                            </View>
                            <View style={styles.bottomRow}>
                                <View style={styles.userRow}>
                                    <Image source={{ uri: review.avatar }} style={styles.avatar} />
                                    <Text style={styles.username}>{review.username}</Text>
                                </View>
                                <View style={[styles.statsRow, { justifyContent: 'flex-end' }]}>
                                    <View style={styles.likeContainer}>
                                        <Text style={styles.reviewStats}>{review.likes}</Text>
                                        <TouchableOpacity onPress={() => toggleLikedReviews(index)}>
                                            <Icon
                                                name={review.liked ? 'heart' : 'heart-outline'}
                                                size={18}
                                                color={review.liked ? '#EE6363' : '#211B17'}
                                                style={styles.icon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.commentContainer}>
                                        <Text style={styles.reviewStats}>{review.comments}</Text>
                                        <Icon name="chatbubble-outline" size={18} color="#211B17" style={styles.icon}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Shadow>
                ))
            )}
            { type === 'comment' && (
                popularReviews.map((review, index) => (
                    <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]} style={popularReviews.length > 1 && { marginBottom: 20 }}>
                        <View style={[ styles.reviewCard, popularReviews.length > 1 && { marginBottom: 2 }]}>
                            <View style={styles.topRow}>
                                <View style={{ paddingHorizontal: 8 }}>
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                </View>
                            </View>
                            <View style={styles.bottomRow}>
                                <View style={styles.userRow}>
                                    <Image source={{ uri: review.avatar }} style={styles.avatar} />
                                    <Text style={styles.username}>{review.username}</Text>
                                </View>
                            </View>
                        </View>
                    </Shadow>
                ))
            )}
            { type === 'notifications' && (
                popularReviews.map((review, index) => (
                    <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]} style={popularReviews.length > 1 && { marginBottom: 20 }}>
                        <View style={[ styles.reviewCard, popularReviews.length > 1 && { marginBottom: 2 }]}>
                            <View style={styles.topRow}>
                                <View style={styles.leftSection}>
                                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                                        <Image source={{ uri: review.image }} style={styles.reviewImage}/>
                                    </Shadow>
                                </View>
                                <View style={styles.rightSection}>
                                    <View style={styles.reviewSeries}>
                                        <Text style={styles.reviewSeriesTitle}>{review.title}</Text>
                                        <Text style={styles.reviewSeriesYear}>{review.year}</Text>
                                    </View>
                                    <View style={styles.stars}>
                                        {Array.from({ length: 5 }, (_, idx) => (
                                            <Star key={idx} name={idx < (review.rating || 0) ? 'star' : 'staro'} size={18} color="#D8A84E" />
                                        ))}
                                    </View>
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                </View>
                            </View>
                        </View>
                    </Shadow>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    popularContainer: {
        marginTop: 20,
        color: '#211B17',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    seeAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAllText: {
        fontSize: 14,
    },
    reviewCard: {
        backgroundColor: '#F5E0CE',
        borderColor: '#211B17',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 16,
        width: 374,
    },
    topRow: {
        flexDirection: 'row',
    },
    leftSection: {
        width: 100,
        alignItems: 'center',
    },
    reviewImage: {
        width: 90,
        height: 130,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#211B17',
        marginBottom: 8
    },
    rightSection: {
        flex: 1,
        marginLeft: 16,
    },
    reviewSeries: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    reviewSeriesTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    reviewSeriesYear: {
        fontSize: 14,
        color: '#211B1750',
        marginLeft: 4,
        top: 2,
    },
    reviewText: {
        top: 4,
        fontSize: 14,
        marginBottom: 8,
        color: '#211B1790',
    },
    stars: {
        flexDirection: 'row',
        gap: 2, 
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 8,
    },
    username: {
        fontSize: 12,
        color: '#211B17',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    reviewStats: {
        fontSize: 12,
        color: '#211B17',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 4,
    },
});

