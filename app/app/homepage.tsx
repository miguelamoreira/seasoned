import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import FrankieBanner from '@/components/homepage/FrankieBanner';
import ComingSoon from '@/components/homepage/ComingSoon';
import PopularReviews from '@/components/homepage/PopularReviews';
import PopularShows from '@/components/homepage/PopularShows';
import ContinueWatching from '@/components/homepage/ContinueWatching';

export default function HomepageScreen() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token && token !== '') {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log("Error checking login status:", error);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const shows = [
        { imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/548/1371270.jpg', title: 'YOU', subtitle: 'Season 3', date: '12th December, 2024' },
        { imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253519.jpg', title: 'Breaking Bad', subtitle: 'Season 4', date: '15th December, 2024' },
        { imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/501/1253515.jpg', title: 'Better Call Saul', subtitle: 'Season X', date: '20th December, 2024' },
    ];

    const popularReviews = [
        {
            imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/4/11308.jpg',
            title: 'Gilmore Girls',
            year: 2000,
            rating: 5,
            review: `If season seven has a million haters, then I am one of them. If season seven has ten haters, then I am one of them. If season seven has only one hater, then that is me.`,
            likes: 2346,
            comments: 60,
            username: 'jane_doe',
            avatarUri: 'https://placehold.jp/30x30.png',
            liked: false,
        },
    ];

    const [popularShows, setPopularShows] = useState([
        { imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/249/623354.jpg' },
        { imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/211/528026.jpg' },
        { imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/499/1247570.jpg' },
        { imageUri: 'https://static.tvmaze.com/uploads/images/medium_portrait/498/1245274.jpg' },
    ]);

    const episodeData = {
        title: "Una tradición familiar",
        seasonEpisode: "S-5 E-10",
        duration: "76 min",
        seriesTitle: "La Casa de Papel",
        imageUri: "https://static.tvmaze.com/uploads/images/large_landscape/380/950352.jpg",
    };
    
    const handleUnfollow = () => {
        console.log("Unfollow button clicked");
    };
    
    const handleLog = () => {
        console.log("Log button clicked");
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {!isLoggedIn && <FrankieBanner />}
                {isLoggedIn && (
                    <ContinueWatching episode={episodeData} onUnfollow={handleUnfollow} onLog={handleLog}/>
                )}
                <ComingSoon shows={shows} />
                <PopularReviews reviews={popularReviews} />
                <PopularShows shows={popularShows} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingHorizontal: 16,
        paddingTop: 42,
        color: '#211B17',
        fontFamily: 'Arimo',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80, 
    },
});
