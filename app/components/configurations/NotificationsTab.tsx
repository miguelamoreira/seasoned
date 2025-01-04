import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function NotificationsTab() {
    const [settings, setSettings] = useState({
        badgesEarned: false,
        newFollowers: true,
        newComments: false,
        newLikesOnReviews: false,
        upcomingEpisodes: true,
        seasonPremieres: true,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <View>
            <Text style={styles.heading}>Push notifications</Text>

            <Text style={styles.subheading}>Activity</Text>
            {[
                { label: 'Badges earned', key: 'badgesEarned' },
                { label: 'New followers', key: 'newFollowers' },
                { label: 'New comments', key: 'newComments' },
                { label: 'New likes on your reviews', key: 'newLikesOnReviews' },
            ].map(({ label, key }) => (
                <View style={styles.switchContainer} key={key}>
                    <Text style={styles.label}>{label}</Text>
                    <Switch
                        value={settings[key as keyof typeof settings]}
                        onValueChange={() => toggleSwitch(key as keyof typeof settings)}
                        thumbColor={settings[key as keyof typeof settings] ? '#82AA59' : '#F5E0CE'}
                        trackColor={{ false: '#403127', true: '#403127' }}
                    />
                </View>
            ))}

            <Text style={styles.subheading}>New releases</Text>
            {[
                { label: 'Upcoming episodes', key: 'upcomingEpisodes' },
                { label: 'Season Premieres', key: 'seasonPremieres' },
            ].map(({ label, key }) => (
                <View style={styles.switchContainer} key={key}>
                    <Text style={styles.label}>{label}</Text>
                    <Switch
                        value={settings[key as keyof typeof settings]}
                        onValueChange={() => toggleSwitch(key as keyof typeof settings)}
                        thumbColor={settings[key as keyof typeof settings] ? '#82AA59' : '#F5E0CE'}
                        trackColor={{ false: '#403127', true: '#403127' }}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontFamily: 'DMSerifText',
        marginVertical: 16,
    },
    subheading: {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'Arimo',
        marginTop: 16,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Arimo',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
});