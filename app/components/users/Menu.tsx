import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

type MenuProps = {
    tabs: { label: string; icon: string; library: 'AntDesign' | 'FontAwesome' }[]; 
    activeTab: string;
    onTabPress: (tab: string) => void;
};

export default function Menu({ tabs, activeTab, onTabPress }: MenuProps) {
    const renderIcon = (icon: string, library: 'AntDesign' | 'FontAwesome', isActive: boolean) => {
        const color = isActive ? '#82AA59' : '#211B17';
        switch (library) {
            case 'AntDesign':
                return <AntDesign name={icon} size={24} color={color} style={styles.icon} />;
            case 'FontAwesome':
                return <FontAwesome name={icon} size={24} color={color} style={styles.icon} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.menuContainer}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onTabPress(tab.label)}
                    style={[
                        styles.tabContainer,
                        activeTab === tab.label && styles.activeTabContainer,
                    ]}
                >
                    {renderIcon(tab.icon, tab.library, activeTab === tab.label)}
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === tab.label && styles.activeTabText,
                        ]}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF4E0',
        paddingVertical: 8,
    },
    tabContainer: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
    },
    activeTabContainer: {
        borderBottomColor: '#82AA59', 
        borderBottomWidth: 4,
    },
    icon: {
        marginBottom: 4,
    },
    tabText: {
        fontSize: 16,
        color: '#211B17',
        fontWeight: '700',
    },
    activeTabText: {
        color: '#82AA59',
    },
});
