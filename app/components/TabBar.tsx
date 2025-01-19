import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

type TabBarProps = {
    isLoggedIn: boolean;
    currentPage: string;
    userId?: number | null; 
};

export default function TabBar(props: TabBarProps) {
    const { isLoggedIn, currentPage, userId } = props;
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const tabs = isLoggedIn
        ? [
              { name: 'Home', icon: 'home' },
              { name: 'Search', icon: 'search' },
              { name: 'Notifications', icon: 'notifications' },
              { name: 'Profile', icon: 'person' },
          ]
        : [
              { name: 'Home', icon: 'home' },
              { name: 'Search', icon: 'search' },
              { name: 'Profile', icon: 'person' },
          ];

    const handleNavigate = (page: string, userId?: number | null) => {
        if (page === 'Profile') {
            if (isLoggedIn) {
                router.push(`/users/${userId}`);
            } else {
                router.push('/main'); 
            }
        } else {
            switch (page.toLowerCase()) {
                case 'home':
                    router.push('/homepage'); 
                    break;
                case 'search':
                    router.push('/search'); 
                    break;
                case 'notifications':
                    router.push('/notifications'); 
                    break;
                default:
                    console.log(`Page not recognized: ${page}`);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { zIndex: keyboardVisible ? -1 : 0 }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => handleNavigate(tab.name, userId)}>
                        <Ionicons name={tab.icon} size={28} color={currentPage === tab.name ? '#82AA59' : '#6A4A36'}/>
                    </TouchableOpacity>
                ))}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#F5E0CE',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
    },
    tab: {
        alignItems: 'center',
    },
});