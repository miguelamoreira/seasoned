import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

type PopularShow = {
    imageUri: string;
};

type PopularShowsProps = {
    shows: PopularShow[];
};

export default function PopularShows({ shows }: PopularShowsProps) {
    const [popularShows, setPopularShows] = useState(shows);
    const router = useRouter();

    const handleSeeAll = (section: string) => {
        console.log(`Navigated to all items in ${section}`);
        router.push('/popularShows')
    };

    const handleMoveToEnd = (index: number) => {
        const updatedShows = [...popularShows];
        const [movedShow] = updatedShows.splice(index, 1);
        updatedShows.push(movedShow);
        setPopularShows(updatedShows);
    };

    return (
        <View style={styles.popularContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.heading}>Popular shows</Text>
                <TouchableOpacity onPress={() => handleSeeAll('Popular Reviews')} style={styles.seeAllContainer}>
                    <Text style={styles.seeAllText}>See all</Text>
                    <Icon name="chevron-forward" size={16} color="#211B17" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollContainer}>
                {popularShows.map((show, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => index === 0 && handleMoveToEnd(index)}
                        style={[
                            styles.popularShowWrapper,
                            index === 1 && styles.secondPopularShow,
                            index === 2 && styles.thirdPopularShow,
                            index === 3 && styles.fourthPopularShow,
                        ]}
                    >
                        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                            <Image source={{ uri: show.imageUri }} style={styles.popularShowImage} />
                        </Shadow>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    popularContainer: {
        marginTop: 20,
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
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
    },
    horizontalScrollContainer: {
        marginTop: 10,
    },
    popularShowWrapper: {
        marginRight: -44,
        alignItems: 'center',
        height: 186,
    },
    secondPopularShow: {
        transform: [{ scale: 0.95 }],
        zIndex: -1,
    },
    thirdPopularShow: {
        transform: [{ scale: 0.9 }],
        zIndex: -2,
    },
    fourthPopularShow: {
        transform: [{ scale: 0.85 }],
        zIndex: -3,
    },
    popularShowImage: {
        width: 130,
        height: 180,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#211B17'
    },
});
