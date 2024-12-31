import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Progress from 'react-native-progress';

import OptionsTab from '@/components/OptionsTab'; 
import Badge from '@/components/Badge';
import { fetchBadges } from '@/api/badgesApi';

interface BadgeData {
    image: string;
    title: string;
    description: string;
    howTo: string;
    progress: number | null;
    earned: boolean;
    id: number; 
}

export default function BadgesScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();
    const [badges, setBadges] = useState<BadgeData[]>([]);

    const sortedBadges = badges.sort((a, b) => Number(a.earned) - Number(b.earned)); 

    useEffect(() => {
        if (userId) {
            fetchBadges(parseInt(userId))
                .then(setBadges)
                .catch((err) => console.error('Error fetching badges:', err));
        }
    }, [userId]);
    
    const earnedBadgesCount = badges.filter((badge) => badge.earned).length;
    const totalBadgesCount = badges.length;
    const progress = totalBadgesCount > 0 ? earnedBadgesCount / totalBadgesCount : 0;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />

            <Text style={styles.heading}>Badges</Text>

            <Progress.Bar
                progress={progress}
                width={378}
                color="#82AA59"
                borderColor="#352A23"
                unfilledColor="#352A23"
                style={{ marginTop: 12, marginBottom: 16 }}
            />

            <FlatList
                data={sortedBadges} 
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                numColumns={2} 
                contentContainerStyle={styles.badgeGrid} 
                renderItem={({ item }) => (
                    <View style={styles.badgeWrapper}>
                        <Badge variant="grid" image={item.image} title={item.title} earned={item.earned} onPress={() => router.push(`/users/${userId}/badges/${item.id}`)}/>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingHorizontal: 16,
        paddingTop: 42,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
        color: '#352A23',
    },
    badgeGrid: {
        paddingBottom: 16, 
    },
    badgeWrapper: {
        width: '48%', 
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: '1%',
    },
});
