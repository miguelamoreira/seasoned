import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useUserContext } from '@/contexts/UserContext';
import { fetchNotificationsConfigurations, updateNotificationsConfigurations } from '@/api/notificationsApi';

export default function NotificationsTab() {
    const { user, token } = useUserContext();
    const [settings, setSettings] = useState({
        earnedBadges: false,
        newFollowers: true,
        newComments: false,
        newLikes: false,
    });

    useEffect(() => {
        const getSettings = async () => {
            try {
                if (user?.user_id) {
                    const fetchedSettings = await fetchNotificationsConfigurations(user.user_id);
                    console.log('fetchedSettings: ', fetchedSettings.data);
                    setSettings({
                        earnedBadges: fetchedSettings.data.earnedBadges,
                        newFollowers: fetchedSettings.data.newFollowers,
                        newComments: fetchedSettings.data.newComments,
                        newLikes: fetchedSettings.data.newLikes,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch notification settings:', error);
            }
        };

        getSettings();
    }, [user]);

    const toggleSwitch = async (key: keyof typeof settings) => {
        if (!settings.hasOwnProperty(key)) {
            console.error(`Invalid setting key: ${key}`);
            return;
        }

        const newSettings = { ...settings, [key]: !settings[key] };

        setSettings(newSettings);

        try {
            if (user?.user_id) {
                await updateNotificationsConfigurations(user.user_id, { [key]: newSettings[key] });
                console.log(`${key} updated successfully to ${newSettings[key]}`);
            }
        } catch (error) {
            console.error(`Failed to update ${key}:`, error);

            setSettings((prevSettings) => ({
                ...prevSettings,
                [key]: prevSettings[key],
            }));
        }
    };

    return (
        <View>
            <Text style={styles.heading}>Push Notifications</Text>

            <Text style={styles.subheading}>Activity</Text>
            {[
                { label: 'Badges earned', key: 'earnedBadges' },
                { label: 'New followers', key: 'newFollowers' },
                { label: 'New comments', key: 'newComments' },
                { label: 'New likes on your reviews', key: 'newLikes' },
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
        fontWeight: '700',
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