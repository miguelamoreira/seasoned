import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

import { updateBadgesVisibility } from '@/api/badgesApi';

type BadgesDisplay = {
    name: string;
    description: string;
    image: string;
    dateEarned?: string;
    earned?: boolean;
};

type BadgesDisplayProps = {
    badges: BadgesDisplay[];
    type: 'profile' | 'edit';
    userId: number;
    currentUserId: number;
    badgesVisibility: boolean;
};

export default function ProfileBadges({ badges, type, userId, currentUserId, badgesVisibility }: BadgesDisplayProps) {
    const router = useRouter();
    const [visibility, setVisibility] = useState(badgesVisibility);

    // Sync visibility state with the badgesVisibility prop
    useEffect(() => {
        setVisibility(badgesVisibility);
    }, [badgesVisibility]);

    // Handle visibility toggle
    const handleToggleVisibility = async (value: boolean) => {
        setVisibility(value);
        try {
            await updateBadgesVisibility(userId, value);
        } catch (error) {
            console.error('Failed to update visibility:', error);
        }
    };

    // Navigate to "See All" badges screen
    const handleSeeAll = (userId: number) => {
        router.push(`/users/${userId}/badges`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.heading}>Badges</Text>

                {/* Switch for edit mode */}
                {type === 'edit' && (
                    <Switch
                        value={visibility}
                        onValueChange={handleToggleVisibility}
                        trackColor={{ false: '#d3d3d3', true: '#82AA59' }}
                        thumbColor={visibility ? '#211B17' : '#f4f3f4'}
                    />
                )}

                {/* See all button for profile mode */}
                {type === 'profile' && userId !== currentUserId && visibility && (
                    <TouchableOpacity onPress={() => handleSeeAll(userId)} style={styles.seeAllContainer}>
                        <Text style={styles.seeAllText}>See all</Text>
                        <Icon name="chevron-forward" size={16} color="#211B17" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Render badges if visibility is true or user is viewing their own profile */}
            {(visibility || userId === currentUserId) && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScrollView}>
                    {badges.map((badge, index) => (
                        <View
                            key={index}
                            style={[
                                styles.badgeContainer,
                                { opacity: badge.earned ? 1 : 0.5 },
                                index === 0 && { marginLeft: 16 },
                            ]}
                        >
                            <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                                <Image
                                    source={{ uri: badge.image }}
                                    style={[styles.badge, !badge.earned && { opacity: 0.5 }]}
                                />
                            </Shadow>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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
        fontSize: 20,
        fontFamily: 'DMSerifText',
        lineHeight: 30,
    },
    badgeScrollView: {
        marginBottom: -8,
    },
    badgeContainer: {
        marginRight: 12,
        paddingBottom: 4,
    },
    badge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#211B17',
    },
});