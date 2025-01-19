import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

interface SeriesDetailsProps {
    image: string
    title: string;
    year: string;
}

export default function SeriesDetails({ image, title, year }: SeriesDetailsProps) {
    return (
        <View style={styles.container}>
            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <Image source={{ uri: image }} style={styles.cover}/>
            </Shadow>
            <View style={styles.seriesData}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.year}>{year}</Text>
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
        width: 180,
        height: 220,
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
