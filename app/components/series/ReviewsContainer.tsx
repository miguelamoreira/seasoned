import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router'; 

import ReviewsDisplay from '@/components/reviews/ReviewsDisplay';
import RatingsDisplay from '@/components/reviews/RatingsDisplay';

type ReviewsContainerProps = {
    reviews: any[];
    ratings: any[],
    type: 'episode' | 'series';  
    seriesId: string;  
    seasonNumber?: string;  
    episodeNumber?: string;  
};

export default function ReviewsContainer({ reviews, ratings, type, seriesId, seasonNumber, episodeNumber }: ReviewsContainerProps) {
    const totalRatings = ratings.reduce((sum, count) => sum + count, 0);
    const weightedSum = ratings.reduce((sum, count, index) => sum + count * index, 0);
    const averageRating = (weightedSum / totalRatings).toFixed(1);
    const router = useRouter(); 

    const handleSeeAll = (section: string) => {
        if (type === 'episode') {
            router.push(`/series/${seriesId}/seasons/${seasonNumber}/${episodeNumber}/reviews`);
        } else {
            router.push(`/series/${seriesId}/reviews`);
        }
    };

    return (
        <View style={styles.reviewsContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.heading}>Reviews</Text>
                <TouchableOpacity onPress={() => handleSeeAll('Reviews')} style={styles.seeAllContainer}>
                    <Text style={styles.seeAllText}>See all</Text>
                    <Icon name="chevron-forward" size={16} color="#211B17" />
                </TouchableOpacity>
            </View>
            <View style={styles.ratingsWrapper}>
                <RatingsDisplay ratings={ratings} average={parseFloat(averageRating)} type="review" />
            </View>
            <View style={styles.reviewsWrapper}>
                <ReviewsDisplay reviews={reviews} type="all" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    reviewsContainer: { 
        marginBottom: 24 
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
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
    ratingsWrapper: {
        marginVertical: 8,
    },
    reviewsWrapper: {
        paddingHorizontal: 16,
    }
});
