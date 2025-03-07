import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/Ionicons';
import Star from 'react-native-vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { useUserContext } from '@/contexts/UserContext'; 

import { likeReview, dislikeReview } from '@/api/reviewLikesApi';

const windowWidth = Dimensions.get('window').width;

type Review = {
    reviewId: string; 
    imageUri: string;
    title: string;
    year: number;
    review: string;
    likes: number;
    comments: number;
    username: string;
    avatarUri: string;
    liked: boolean;
    rating: number;
};

type PopularReviewsProps = {
    reviews: Review[];
    showHeading?: boolean;
};

export default function PopularReviews({ reviews, showHeading = true }: PopularReviewsProps) {
    const [popularReviews, setPopularReviews] = useState(reviews);
    const router = useRouter();
    const { user } = useUserContext();
    const loggedInId = user?.user_id || null;

    useEffect(() => {
        setPopularReviews(reviews);
    }, [reviews]);

    const handleSeeAll = () => {
        router.push('/popularReviews');
    };

    const toggleLike = async (index: number) => {
        if (loggedInId === null) {
            console.warn('User must be logged in to like or dislike reviews.');
            return;
        }
    
        const targetReview = popularReviews[index];
    
        try {
            console.log('Toggling like for review:', targetReview.reviewId);
    
            if (targetReview.liked) {
                const response = await dislikeReview(loggedInId, targetReview.reviewId);
                targetReview.likes -= 1;
            } else {
                const response = await likeReview(loggedInId, targetReview.reviewId);
                targetReview.likes += 1;
            }
    
            targetReview.liked = !targetReview.liked;
    
            setPopularReviews(prevReviews => 
                prevReviews.map((review, idx) => 
                    idx === index ? { ...review, liked: targetReview.liked, likes: targetReview.likes } : review
                )
            );
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };    

    return (
        <View style={styles.popularContainer}>
            {showHeading && (
                <View style={styles.sectionHeader}>
                    <Text style={styles.heading}>Popular reviews</Text>
                    <TouchableOpacity onPress={handleSeeAll} style={styles.seeAllContainer}>
                        <Text style={styles.seeAllText}>See all</Text>
                        <Icon name="chevron-forward" size={16} color="#211B17" />
                    </TouchableOpacity>
                </View>
            )}
            {popularReviews.map((review, index) => (
                <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]} style={popularReviews.length > 1 && { marginBottom: 20 }}>
                    <View style={[styles.reviewCard, popularReviews.length > 1 && { marginBottom: 2 }]}>
                        <View style={styles.topRow}>
                            <View style={styles.leftSection}>
                                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                                    <Image source={{ uri: review.imageUri }} style={styles.reviewImage}/>
                                </Shadow>
                            </View>
                            <View style={styles.rightSection}>
                                <View style={styles.reviewSeries}>
                                    <Text style={styles.reviewSeriesTitle}>{review.title}</Text>
                                    <Text style={styles.reviewSeriesYear}>{review.year}</Text>
                                </View>
                                <View style={styles.stars}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star key={index} name={index < review.rating ? 'star' : 'staro'} size={18} color="#D8A84E"/>
                                    ))}
                                </View>
                                <Text style={styles.reviewText}>{review.review}</Text>
                            </View>
                        </View>
                        <View style={styles.bottomRow}>
                            <View style={styles.userRow}>
                                <Image source={{ uri: review.avatarUri }} style={styles.avatar} />
                                <Text style={styles.username}>{review.username}</Text>
                            </View>
                            <View style={styles.statsRow}>
                                <View style={styles.likeContainer}>
                                    <Text style={styles.reviewStats}>{review.likes}</Text>
                                    <TouchableOpacity onPress={() => toggleLike(index)}>
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
            ))}
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
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
    },
    reviewCard: {
        backgroundColor: '#F5E0CE',
        borderColor: '#211B17',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 16,
        width: windowWidth - 36,
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