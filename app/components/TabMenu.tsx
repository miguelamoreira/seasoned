import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Shadow } from 'react-native-shadow-2';

type Tab = {
    label: string;
    icon: string;
};

type TabMenuProps = {
    tabs: Tab[];
    activeTab: string;
    onTabPress: (tab: string) => void;
    isLoggedIn: boolean;
};

export default function TabMenu({ tabs, activeTab, onTabPress, isLoggedIn }: TabMenuProps) {
    if (!isLoggedIn) {
        return null;
    }

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab, index) => {
                const isActive = activeTab === tab.label;

                const TabContent = (
                    <TouchableOpacity key={index} onPress={() => onTabPress(tab.label)}
                        style={[ styles.tab, isActive ? styles.activeTab : styles.inactiveTab ]}
                        activeOpacity={0.9}
                    >
                        <Icon name={tab.icon} size={20} style={styles.tabIcon} />
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );

                return isActive ? (
                    <Shadow key={index} distance={2} startColor={'#211B17'} offset={[2, 4]}>
                        {TabContent}
                    </Shadow>
                ) : (
                    TabContent
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#FFF4E0',
        paddingVertical: 8,
        borderRadius: 16,
        marginHorizontal: 16,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
    },
    activeTab: {
        backgroundColor: '#82AA59',
        borderWidth: 2,
        borderColor: '#211B17',
    },
    inactiveTab: {
        backgroundColor: 'transparent',
    },
    tabIcon: {
        marginRight: 8,
    },
    tabText: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'Arimo',
    },
    activeTabText: {
        color: '#211B17',
    },
});
