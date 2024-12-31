import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

type BadgesDisplay = {
    name: string;
    description: string;
    image: string;
    dateEarned?: string;
    locked?: boolean;
};

type BadgesDisplayProps = {
    badges: BadgesDisplay[];
    type: 'profile' | 'edit';
};

export default function ProfileBadges({ badges, type }: BadgesDisplayProps) {
    const router = useRouter();
    const [visibility, setVisibility] = useState(true);

    const handleSeeAll = (userId: number) => {
        router.push(`/users/${userId}/badges`)
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.heading}>Badges</Text>
                {type === 'edit' && (
                <Switch value={visibility} onValueChange={(value) => setVisibility(value)} trackColor={{ false: '#d3d3d3', true: '#82AA59' }} thumbColor={visibility ? '#211B17' : '#f4f3f4'}/>
                )}
                {type === 'profile' && (
                <TouchableOpacity onPress={() => handleSeeAll('Badges')} style={styles.seeAllContainer}>
                    <Text style={styles.seeAllText}>See all</Text>
                    <Icon name="chevron-forward" size={16} color="#211B17" />
                </TouchableOpacity>
                )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScrollView}>
                {badges.map((badge, index) => (
                <View key={index} style={[ styles.badgeContainer, { opacity: visibility ? 1 : 0.5 } ]}>
                    <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                    <Image source={{ uri: badge.image }} style={[styles.badge, badge.locked && { opacity: 0.5 }]}/>
                    </Shadow>
                </View>
                ))}
            </ScrollView>
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
