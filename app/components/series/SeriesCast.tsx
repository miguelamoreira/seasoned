import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ImageBackground } from 'react-native';

export default function SeriesCast({ cast }: { cast: { name: string; role: string; image: string }[] }) {
    return (
        <ImageBackground 
            source={require('../../assets/images/cast_bg.png')} 
            style={styles.castContainer}
        >
            <Text style={styles.heading}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cast.map((actor) => (
                    <View key={`${actor.name}-${actor.role}`} style={styles.castCard}>
                        <Image source={{ uri: actor.image }} style={styles.castImage} />
                        <Text style={styles.castName}>{actor.name}</Text>
                        <Text style={styles.castRole}>{actor.role}</Text>
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    castContainer: { 
        marginBottom: 24,
        padding: 16,
        marginLeft: -16,
        marginRight: -16,
    },
    heading: { 
        fontSize: 20,
        fontFamily: 'DMSerifText', 
        marginBottom: 12,
        color: '#FFF4E0',
        paddingHorizontal: 16,
    },
    castCard: { 
        marginRight: 16, 
        alignItems: 'center', 
        width: 100, 
    },
    castImage: { 
        width: 80, 
        height: 110, 
        borderRadius: 8, 
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#211B17',
    },
    castName: { 
        fontSize: 14, 
        color: '#FFF4E0',
        fontWeight: 'bold', 
        textAlign: 'center',
    },
    castRole: { 
        fontSize: 12, 
        color: '#FFF4E070',
        textAlign: 'center',
    },
});
