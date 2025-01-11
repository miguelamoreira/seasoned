import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Shadow } from 'react-native-shadow-2';

type Season = {
    number: number;
    onPress: () => void;
};

type SeasonDisplayProps = {
    seasons: Season[];
};

export default function SeasonDisplay({ seasons }: SeasonDisplayProps) {
    const renderSeason = ({ item }: { item: Season }) => (
        <Shadow distance={2} startColor={'#211B17'} offset={[6, 4]}>
            <TouchableOpacity style={styles.seasonButton} onPress={item.onPress} activeOpacity={0.9}>
                <Text style={styles.seasonText} numberOfLines={1}>
                    Season {item.number}
                </Text>
                <Icon name="chevron-right" size={20} style={styles.icon} />
            </TouchableOpacity>
        </Shadow>
    );

    return (
        <FlatList
            data={seasons}
            keyExtractor={(item) => `season-${item.number}`}
            renderItem={renderSeason}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.container}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        fontFamily: 'Arimo',
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    seasonButton: {
        backgroundColor: '#C1855F',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#211B17',
        marginHorizontal: 4,
        alignItems: 'center',
        height: 92,
        justifyContent: 'center',
        width: 180,
        flexDirection: 'row',
        gap: 12,
        position: 'relative',
    },
    seasonText: {
        color: '#211B17',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'left',
        flex: 1,
    },
    icon: {
        position: 'absolute',
        right: 12,
    },
});
