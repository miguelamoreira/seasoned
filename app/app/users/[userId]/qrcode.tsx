import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg'; 

import OptionsTab from '@/components/OptionsTab';

export default function QRCodeScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();

    
    const baseURL = 'exp://192.168.1.71:8081'  // idk if it's the correct url or not 
    const profileLink = `${baseURL}/user/${userId}`;
    console.log('link: ', profileLink);
    

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />
            
            <Text style={styles.heading}>Invite</Text>

            <View style={styles.qrContainer}>
                <QRCode value={profileLink} size={260} color="#211B17" backgroundColor="#D8A84E" quietZone={16}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    qrContainer: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
