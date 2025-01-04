import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import TabMenu from '@/components/TabMenu';
import DataTab from '@/components/configurations/DataTab';
import NotificationsTab from '@/components/configurations/NotificationsTab';

export default function ConfigurationsScreen() {
    const { userId, activeTab: initialActiveTab } = useLocalSearchParams<{ userId: string; activeTab: string }>();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'Data' | 'Notifications'>(
        (initialActiveTab as 'Data' | 'Notifications') || 'Data'
    );

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'Data' | 'Notifications');
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />

            <TabMenu
                tabs={[
                    { label: 'Data', icon: 'person' },
                    { label: 'Notifications', icon: 'notifications' },
                ]}
                activeTab={activeTab}
                onTabPress={handleTabPress}
                isLoggedIn={true}
            />

            <View style={styles.contentContainer}>
                {activeTab === 'Data' ? <DataTab /> : <NotificationsTab />}
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
    contentContainer: {
        flex: 1,
        marginTop: 16,
        paddingHorizontal: 16,
    },
});