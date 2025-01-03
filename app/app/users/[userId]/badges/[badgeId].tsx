import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Badge from '@/components/Badge';
import OptionsTab from '@/components/OptionsTab'; 
import { fetchBadgeById } from '@/api/badgesApi';

interface BadgeData {
    image: string;
    title: string;
    description: string;
    howTo: string;
    date: string | null;
    progress: number | null;
    earned: boolean;
}

const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    try {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    } catch (error) {
        console.error('Error formatting date:', error);
        return null;
    }
};

export default function BadgeScreen() {
    const { userId, badgeId } = useLocalSearchParams<{ userId: string; badgeId: string }>();
    const router = useRouter();
    const [badge, setBadge] = useState<BadgeData | null>(null); 

    useEffect(() => {
        if (userId && badgeId) {
            fetchBadgeById(userId, badgeId)
                .then((fetchedBadge) => {
                    const formattedBadge: BadgeData = {
                        image: fetchedBadge.image,
                        title: fetchedBadge.name, 
                        description: fetchedBadge.description,
                        howTo: fetchedBadge.howTo,
                        date: formatDate(fetchedBadge.earned_date),
                        progress: fetchedBadge.earned ? 1 : 0,
                        earned: fetchedBadge.earned,
                    };
                    setBadge(formattedBadge);
                })
                .catch((err) => {
                    console.error('Error fetching badge:', err);
                });
        }
    }, [userId, badgeId]);

    if (!badge) {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <OptionsTab type="back" onBackPress={() => router.back()} />
                <Text style={styles.errorText}>Badge not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />

            <Badge
                variant={badge.earned ? 'details' : 'progress'}
                image={badge.image}
                title={badge.title}
                description={badge.description}
                howTo={badge.howTo}
                date={badge.date}
                progress={badge.earned ? 1 : 0} 
                earned={badge.earned}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
        paddingBottom: 60,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 18,
        marginTop: 20,
        paddingHorizontal: 16,
    }
});
