import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';

import OptionsTab from '@/components/OptionsTab';
import ReviewsDisplay from '@/components/reviews/ReviewsDisplay';

import { fetchPopularReviews } from '@/api/reviewsApi';
import { fetchLikedReviews } from '@/api/reviewLikesApi';

export default function PopularReviewsScreen() {
    const { user, token } = useUserContext();
    const router = useRouter();
    const [popularReviews, setPopularReviews] = useState<any[]>([]);
    const [likedReviews, setLikedReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPopularReviews();

                if (user?.user_id) {
                    const likedData = await fetchLikedReviews(user?.user_id);
                    setLikedReviews(likedData);

                    if (data?.length > 0) {
                        const mappedReviews = data.map((review: any) => {
                            const isLiked = likedData.some(
                                (likedReview: any) => likedReview.review_id === review.reviewId
                            );

                            return {
                                id: review?.reviewId,
                                image: review?.series?.posterUrl,
                                title: review?.series?.title,
                                year: new Date(review?.series?.year).getFullYear(),
                                rating: review?.rating,
                                review: review?.comment,
                                likes: review?.likeCount || 0,
                                comments: review?.comments?.length || 0,
                                username: review?.user?.name,
                                avatar: review?.user?.avatar,
                                liked: isLiked,
                            };
                        });

                        setPopularReviews(mappedReviews);
                    } else {
                        setPopularReviews([]);
                    }
                } else {
                    if (data?.length > 0) {
                        const mappedReviews = data.map((review: any) => ({
                            id: review?.reviewId,
                            image: review?.series?.posterUrl,
                            title: review?.series?.title,
                            year: new Date(review?.series?.year).getFullYear(),
                            rating: review?.rating,
                            review: review?.comment,
                            likes: review?.likeCount || 0,
                            comments: review?.comments?.length || 0,
                            username: review?.user?.name,
                            avatar: review?.user?.avatar,
                            liked: false,
                        }));

                        setPopularReviews(mappedReviews);
                    } else {
                        setPopularReviews([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setPopularReviews([]);
            }
        };

        fetchData();
    }, [user?.user_id]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            <View style={styles.contentContainer}>
                <Text style={styles.heading}>Popular Reviews</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ReviewsDisplay reviews={popularReviews} type="notOwn" page="series" />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
    },
});