import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

export default function FrankieBanner() {
    return (
        <View style={styles.frankieContainer}>
            <View style={styles.frankieContent}>
                <Text style={styles.frankieHeading}>
                    "The only drama I need is on screen"
                </Text>
                <Text style={styles.frankieText}>
                    With <Text style={{ fontWeight: '700' }}>Seasoned</Text>, keep the drama where it belongs - on your favourite shows!
                </Text>
            </View>
            <Image source={require('../../assets/images/frankie_1.png')} style={styles.frankieImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    frankieContainer: {
        flexDirection: 'row',
    },
    frankieContent: {
        flexDirection: 'column',
        width: '62%',
    },
    frankieHeading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        width: 250,
    },
    frankieText: {
        fontSize: 16,
        top: 12,
    },
    frankieImage: {
        width: 130,
        height: 120,
        marginTop: 20,
        marginHorizontal: 16,
    },
});