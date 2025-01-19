import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

interface TabsProps {
    isEpisodeView: boolean;
    onTabChange: (tab: string) => void;
}

export default function Tabs({ isEpisodeView, onTabChange }: TabsProps) {
    return (
        <View style={styles.container}>
            {isEpisodeView ? (
                <TouchableOpacity style={[styles.tab, !isEpisodeView && styles.activeTab]} onPress={() => onTabChange('Series')}>
                    <Text style={[styles.tabText, !isEpisodeView && styles.activeTabText]}>Series</Text>
                </TouchableOpacity>
            ) : (
                <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                    <TouchableOpacity style={[styles.tab, !isEpisodeView && styles.activeTab]} onPress={() => onTabChange('Series')}>
                        <Text style={[styles.tabText, !isEpisodeView && styles.activeTabText]}>Series</Text>
                    </TouchableOpacity>
                </Shadow>
            )}

            {isEpisodeView ? (
                <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                    <TouchableOpacity style={[styles.tab, isEpisodeView && styles.activeTab]} onPress={() => onTabChange('Episodes')}>
                        <Text style={[styles.tabText, isEpisodeView && styles.activeTabText]}>Episodes</Text>
                    </TouchableOpacity>
                </Shadow>
            ) : (
                <TouchableOpacity style={[styles.tab, isEpisodeView && styles.activeTab]} onPress={() => onTabChange('Episodes')}>
                    <Text style={[styles.tabText, isEpisodeView && styles.activeTabText]}>Episodes</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 40,
        justifyContent: 'center',
        gap: 32,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 12,
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
    tabText: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Arimo',
    },
    activeTabText: {
        color: '#211B17',
    },
});
