import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function EpisodesHeader({ image }: { image: string }) {
    return (
        <View style={styles.headerContainer}>
            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <Image source={{ uri: image }} style={styles.episodesImage} />
            </Shadow>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: { 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 8, 
        marginBottom: 16,
    },
    episodesImage: { 
        width: 280, 
        height: 190, 
        borderRadius: 8,
        marginBottom: 16, 
        borderWidth: 4, 
        borderColor: '#211B17' 
    },
});
