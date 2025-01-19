import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

interface EpisodeDetailsProps {
    image: string
    title: string;
    season: number;
    episode: number;
    series: string;
}

export default function EpisodeDetails({ image, title, season, episode, series }: EpisodeDetailsProps) {
    return (
        <View style={styles.container}>
            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <Image source={{ uri: image }} style={styles.cover}/>
            </Shadow>
            <View style={styles.seriesData}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.year}>Season {season} Episode {episode}</Text>
                <Text>{series}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 16,
        fontFamily: 'Arimo',
    },
    seriesData: {
        flexDirection: 'column',
        gap: 2,
        marginTop: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cover: {
        width: 280,
        height: 180,
        borderRadius: 8,
        borderWidth: 4,
        borderColor: '#211B17'
    },
    title: {
        color: '#211B17',
        fontSize: 20,
        fontWeight: '700',
    },
    year: {
        color: '#211B1770',
        fontSize: 14,
    },
});
