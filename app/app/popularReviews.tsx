import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import ReviewsDisplay from '@/components/reviews/ReviewsDisplay';

import { fetchPopularReviews } from '@/api/reviewsApi';

export default function PopularReviewsScreen() {
    const router = useRouter();
    const [popularReviews, setPopularReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPopularReviews();
    
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
        };
    
        fetchData();
    }, []);    

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()}></OptionsTab>
            <View style={styles.contentContainer}>
                <Text style={styles.heading}>Popular Reviews</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ReviewsDisplay reviews={popularReviews} type="notOwn" page="series"/>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
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

})