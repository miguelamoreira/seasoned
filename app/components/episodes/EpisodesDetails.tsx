import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function EpisodesDetails({ title, date, bio }: { title: string; date: string; bio: string; }) {
    return (
        <View>
            <View style={styles.episodesDetails}>
                <Text style={styles.episodesTitle}>{title}</Text>
            </View>
            <Text style={styles.producer}>Aired on <Text style={{ fontWeight: '700', color: '#211B17' }}>{date}</Text></Text>
            <View style={styles.bioContainer}>
                <Text style={styles.episodesBio}>{bio}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    episodesDetails: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16,
        flexWrap: 'wrap',
    },
    episodesTitle: { 
        fontSize: 24, 
        fontFamily: 'DMSerifText',
        color: '#211B17', 
        marginRight: 4,
        flexWrap: 'wrap',
        width: windowWidth,
    },
    producer: { 
        fontSize: 14, 
        marginBottom: 12, 
        color: '#211B1770',
        paddingHorizontal: 16,
    },
    bioContainer: { 
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    episodesBio: { 
        fontSize: 14, 
        color: '#211B17' 
    },
});