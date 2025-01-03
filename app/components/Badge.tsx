import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { Shadow } from 'react-native-shadow-2';

interface BadgeProps {
    variant: 'grid' | 'details' | 'progress'; 
    image: string; 
    title: string; 
    description?: string; 
    howTo?: string; 
    date?: string | null; 
    progress?: number | null; 
    earned: boolean; 
    onPress?: () => void;
}

export default function Badge({ variant, image, title, description, howTo, date, progress, earned, onPress }: BadgeProps) {
    if (variant === 'grid') {
        return (
            <View style={[styles.gridContainer, !earned && { opacity: 0.5 }]}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TouchableOpacity style={styles.imageContainerGrid} activeOpacity={0.9} onPress={onPress}>
                        <Image source={{ uri: image }} style={styles.imageGrid} />
                    </TouchableOpacity>
                </Shadow>
                <Text style={styles.titleGrid}>{title}</Text>
            </View>
        );
    }

    if (variant === 'details') {
        return (
            <View style={styles.detailsContainer}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <View style={styles.imageContainerLarge}>
                        <Image source={{ uri: image }} style={styles.imageLarge} />
                    </View>
                </Shadow>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
                {howTo && <Text style={styles.howTo}>{howTo}</Text>}
                {date && <Text style={styles.date}>Badge earned on: {date}</Text>}
            </View>
        );
    }

    if (variant === 'progress') {
        return (
            <View style={[styles.progressContainer, !earned && { opacity: 0.5 }]}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <View style={styles.imageContainerLarge}>
                        <Image source={{ uri: image }} style={styles.imageLarge} />
                    </View>
                </Shadow>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
                {typeof progress === 'number' && (
                    <Progress.Bar
                        progress={progress}
                        width={378}
                        color="#82AA59"
                        borderColor="#352A23"
                        unfilledColor="#352A23"
                        style={{ marginTop: 12, marginBottom: 16 }}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    gridContainer: {
        alignItems: 'center',
        margin: 8,
        color: '#211B17',
        fontFamily: 'Arimo',
    },
    detailsContainer: {
        alignItems: 'center',
        backgroundColor: '#FFF4E0',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        color: '#211B17',
        fontFamily: 'Arimo',
        marginVertical: 24,
    },
    progressContainer: {
        alignItems: 'center',
        backgroundColor: '#FFF4E0',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        color: '#211B17',
        fontFamily: 'Arimo',
        marginVertical: 24,
    },
    imageContainerGrid: {
        width: 148,
        height: 148,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    imageGrid: {
        width: 148,
        height: 148,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: '#211B17',
        resizeMode: 'contain',
    },
    imageContainerLarge: {
        width: 220,
        height: 220,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    imageLarge: {
        width: 220,
        height: 220,
        borderRadius: 120,
        borderWidth: 4,
        borderColor: '#211B17',
        resizeMode: 'contain',
    },
    titleGrid: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        marginBottom: 32,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
    },
    howTo: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
        color: '#211B1770',
    },
    date: {
        fontSize: 16,
        marginTop: 60,
    },
});