import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { Shadow } from 'react-native-shadow-2';

export default function SeriesAlert({ release }: { release: string }) {
    return (
        <View style={styles.alertContainer}>
            <Shadow distance={2} startColor={'#211B17'} offset={[1, 2]}>
            <TouchableOpacity style={styles.button}>
                <Icon name="notifications" size={20} color="#211B17"></Icon>
            </TouchableOpacity>
            </Shadow>
            <Text style={styles.alertDate}>New season coming <Text style={{ fontWeight: '700' }}>{release}</Text></Text>
        </View>
    );
}

const styles = StyleSheet.create({
    alertContainer: { 
        marginBottom: 16,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    button: {
        width: 35,
        height: 35,
        backgroundColor: '#D8A84E',
        borderWidth: 2,
        borderColor: '#211B17',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertDate: { 
        fontSize: 14, 
        color: '#211B17' 
    },
});
