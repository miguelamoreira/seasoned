import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Shadow } from 'react-native-shadow-2';

interface OptionsTabProps {
    type: 'back' | 'cross' | 'cross-check';
    onBackPress?: () => void;
    onCrossPress?: () => void;
    onCheckPress?: () => void;
}

export default function OptionsTab({ type, onBackPress, onCrossPress, onCheckPress }: OptionsTabProps) {
    return (
        <View style={styles.optionsContainer}>
            {type === 'back' && (
                <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                    <TouchableOpacity onPress={onBackPress} style={styles.button} activeOpacity={0.9}>
                        <Ionicons name="arrow-back" size={24} color="#FFF4E0" />
                    </TouchableOpacity>
                </Shadow>
            )}
            {type === 'cross' && (
                <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                    <TouchableOpacity onPress={onCrossPress} style={styles.button} activeOpacity={0.9}>
                        <Ionicons name="close" size={24} color="#FFF4E0" />
                    </TouchableOpacity>
                </Shadow>
            )}
            {type === 'cross-check' && (
                <View style={styles.crossCheckContainer}>
                    <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                        <TouchableOpacity onPress={onCrossPress} style={styles.button} activeOpacity={0.9}>
                            <Ionicons name="close" size={24} color="#FFF4E0" />
                        </TouchableOpacity>
                    </Shadow>
                    <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                        <TouchableOpacity onPress={onCheckPress} style={styles.button} activeOpacity={0.9}>
                            <Ionicons name="checkmark" size={24} color="#FFF4E0" />
                        </TouchableOpacity>
                    </Shadow>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    crossCheckContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        padding: 4,
        backgroundColor: '#6A4A36',
        width: 35,
        height: 35,
        borderColor: '#211B17',
        borderWidth: 2,
        borderRadius: 30,
    },
})