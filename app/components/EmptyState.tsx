import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type EmptyStateType =
    | 'recentSearches'
    | '404'
    | 'noReviews'
    | 'noLists'
    | 'myActivity'
    | 'friendsActivity'
    | 'noLikes'
    | 'emptyWatchlist'
    | 'noDrops'
    | 'noNotifs'
    | 'noFollowingShows'
    | 'emptyDiary'
    | 'noFollowing'
    | 'noFollowers'
    | 'emptyPage';

type EmptyStateProps = {
    type: EmptyStateType; 
};

export default function EmptyState({ type }: EmptyStateProps) {
    const imageSource = require('@/assets/images/frankie_3.png');

    const textMapping: Record<EmptyStateType, string> = {
        recentSearches: "Your search history is empty. Let’s find something new to fill it up!",
        '404': "No results... guess you’ve got very unique taste!",
        noReviews: "Time to cook up a review and share it with the world!",
        noLists: "Your lists are still in the oven. It’s time to bake up a collection of shows!",
        myActivity: "Looks like you’re in a pilot stage. Start tracking your shows and interacting with other users!",
        friendsActivity: "Your friends seem to be marinating their TV time. Come back later to see the final plates!",
        noLikes: "No likes yet? Don’t treat your opinions like a secret recipe!",
        emptyWatchlist: "Your watchlist must be still in its pilot episode. Add some series to continue the season!",
        noDrops: "Sometimes shows don’t pass the taste test. Don’t be afraid to drop them!",
        noNotifs: "Your notifications seem to be out for lunch. Try following a few shows while you wait for them!",
        noFollowingShows: "Just like a food diet, your watching should be varied. Try following a show to keep things interesting!",
        emptyDiary: "On a watching hiatus? Break it by logging an episode or a show.",
        noFollowing: "Your following list is defrosting. Follow some users to speed up the process.",
        noFollowers: "The ingredients are all here. Keep sharing and watch your follower list start to come together!",
        emptyPage: "This page is as empty as a pantry before grocery day.",
    };

    const text = textMapping[type];

    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.image} />
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    image: {
        width: 325,
        height: 160,
        marginBottom: 24,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 16,
        color: '#211B17',
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'Arimo'
    },
});
