import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Progress from 'react-native-progress';

const windowWidth = Dimensions.get('window').width;

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


    useEffect(() => {
        if (userId) {
            fetchBadges(userId)
                .then((fetchedBadges) => {
                    const sortedBadges = fetchedBadges.sort((a: { earned: boolean; }, b: { earned: boolean; }) => {
                        if (a.earned === b.earned) return 0;
                        return a.earned ? -1 : 1;
                    });
                    setBadges(sortedBadges);
                })
                .catch((error) => {
                    console.error('Error fetching badges:', error);
                });
        }
    }, [userId]);    
    
    const earnedBadgesCount = badges.filter((badge) => badge.earned).length;
    const totalBadgesCount = badges.length;
    const progress = totalBadgesCount > 0 ? earnedBadgesCount / totalBadgesCount : 0;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />

            <Text style={styles.heading}>Badges</Text>

            <View style={{ paddingHorizontal: 16, }}>
            <Progress.Bar
                progress={progress}
                width={windowWidth - 32}
                color="#82AA59"
                borderColor="#352A23"
                unfilledColor="#352A23"
                style={{ marginTop: 12, marginBottom: 16, }}
            />
            </View>

            <FlatList
                data={badges}  // Render sorted badges directly
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} 
                contentContainerStyle={styles.badgeGrid} 
                renderItem={({ item }) => (
                    <View style={styles.badgeWrapper}>
                        <Badge
                            variant="grid"
                            image={item.image}
                            title={item.title}
                            earned={item.earned}
                            onPress={() => router.push(`/users/${userId}/badges/${item.id}`)}
                        />
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
        paddingTop: 42,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
        color: '#352A23',
        paddingHorizontal: 16,
    },
    badgeGrid: {
        paddingBottom: 16, 
        paddingHorizontal: 16,
    },
    badgeWrapper: {
        width: '48%', 
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: '1%',
    },
});