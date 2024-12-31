import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

type Stats = {
    episodes: number;
    months: number;
    weeks: number;
    days: number;
    thisYearEpisodes: number;
};

type ProfileStatsProps = {
    stats: Stats;
    type: 'profile' | 'edit'; 
};

const formatLabel = (count: number, singular: string, plural: string) =>
    count === 1 ? singular : plural;

export default function ProfileStats({ stats, type }: ProfileStatsProps) {
    return (
        <View style={[styles.container, type === 'edit' && styles.editMode]}>
            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.episodes}</Text>
                        <Text style={styles.statLabel}>
                            {formatLabel(stats.episodes, 'episode', 'episodes')}
                        </Text>
                        <Text style={styles.subLabel}>
                            {stats.thisYearEpisodes} this year
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.timeContainer}>
                        <View style={styles.timeRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.months}</Text>
                                <Text style={styles.statLabel}>
                                    {formatLabel(stats.months, 'month', 'months')}
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.weeks}</Text>
                                <Text style={styles.statLabel}>
                                    {formatLabel(stats.weeks, 'week', 'weeks')}
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.days}</Text>
                                <Text style={styles.statLabel}>
                                    {formatLabel(stats.days, 'day', 'days')}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.footerText}>spent watching TV</Text>
                    </View>
                </View>
            </Shadow>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#9C7351',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#211B17',
        width: '100%',
    },
    editMode: {
        opacity: 0.6, 
    },
    statItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.7,
    },
    statNumber: {
        fontSize: 28,
        color: '#211B17',
        fontFamily: 'DMSerifText',
    },
    statLabel: {
        fontSize: 16,
        color: '#211B1790',
        fontFamily: 'DMSerifText',
        marginTop: 4,
    },
    subLabel: {
        fontSize: 12,
        color: '#211B1780',
        fontFamily: 'Arimo',
        marginTop: 4,
    },
    divider: {
        width: 2,
        height: '100%',
        backgroundColor: '#211B17',
        marginHorizontal: 8,
    },
    timeContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    footerText: {
        marginTop: 8,
        marginLeft: 14,
        fontSize: 12,
        color: '#211B1780',
        fontFamily: 'Arimo',
        alignSelf: 'flex-start',
    },
});
