import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function SeriesDetails({ title, year, creator, genres }: { title: string; year: string; creator: string; genres: string[] }) {
    return (
        <View>
            <View style={styles.seriesDetails}>
                <Text style={styles.seriesTitle}>{title}</Text>
                <Text style={styles.seriesYear}>({year})</Text>
            </View>
            <Text style={styles.creator}>Created by <Text style={{ fontWeight: '700', color: '#211B17' }}>{creator}</Text></Text>
            <View style={styles.genres}>
                {genres.map((genre, index) => (
                    <Shadow key={`${genre}-${index}`} distance={1} startColor={'#211B17'} offset={[1, 2]}>
                        <Text key={`${genre}-${index}`} style={styles.genreTag}>
                            {genre}
                        </Text>
                    </Shadow>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    seriesDetails: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16,
    },
    seriesTitle: { 
        fontSize: 24, 
        fontFamily: 'DMSerifText',
        color: '#211B17', 
        marginRight: 4,
    },
    seriesYear: { 
        fontSize: 16, 
        color: '#211B1770',
    },
    creator: { 
        fontSize: 14, 
        marginBottom: 12, 
        color: '#211B1770',
        paddingHorizontal: 16,
    },
    genres: { 
        flexDirection: 'row', 
        marginBottom: 16,
        gap: 8,
        paddingHorizontal: 16,
    },
    genreTag: { 
        backgroundColor: '#82AA59', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 16, 
        borderWidth: 2,
        borderColor: '#211B17',
        fontWeight: '700',
    },
});
