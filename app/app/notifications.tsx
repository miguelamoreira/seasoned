import React from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList } from 'react-native';
import { useUserContext } from '@/contexts/UserContext';
import TabBar from '@/components/TabBar';
import NotificationCard from '@/components/NotificationCard';

export default function NotificationsScreen() {
    const { user, token } = useUserContext();

    const notificationsData = {
        social: {
            today: [
                {
                    type: 'activity',
                    variant: 'newComments',
                    data: {
                        user: 'user',
                        avatar: 'https://via.placeholder.com/50',
                        message: 'user added a comment to your review',
                        comment: [
                            {
                                comment_id: 1,
                                image: 'https://static.tvmaze.com/uploads/images/large_landscape/434/1085555.jpg',
                                review: 'Blablabla',
                                rating: 4,
                            },
                        ],
                    },
                    read: false,
                    key: 'activity-today-1',
                },
                {
                    type: 'activity',
                    variant: 'earnedBadges',
                    data: {
                        message: 'You earned a new badge: Tastemaker'
                    },
                    read: false,
                    key: 'activity-today-2',
                },
                {
                    type: 'activity',
                    variant: 'newLikes',
                    data: {
                        user: 'user',
                        avatar: 'https://via.placeholder.com/50',
                        message: 'user liked your review',
                        reviews: [
                            {
                                review_id: 1,
                                image: 'https://static.tvmaze.com/uploads/images/large_landscape/434/1085555.jpg',
                                title: 'Firefly Lane',
                                year: 2022,
                                review: 'Blablabla',
                                rating: 4,
                            },
                        ],
                    },
                    read: false,
                    key: 'activity-today-3',
                },
            ],
            thisWeek: [
                {
                    type: 'activity',
                    variant: 'newFollowers',
                    data: {
                        user: 'user',
                        avatar: 'https://via.placeholder.com/50',
                        message: 'user followed you'
                    },
                    read: true,
                    key: 'activity-thisweek-1',
                },
            ],
        },
    };

    const renderItem = ({ item }: { item: any }) => (
        <NotificationCard
            type={item.type}
            variant={item.variant}
            data={item.data}
            read={item.read}
        />
    );

    const renderSectionTitle = (title: string) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );

    const tabData = [
        { key: 'today', data: notificationsData.social.today },
        { key: 'thisWeek', data: notificationsData.social.thisWeek },
    ];

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Text style={styles.heading}>Notifications</Text>

            <FlatList
                data={tabData}
                renderItem={({ item }) => (
                    <>
                        {renderSectionTitle(item.key === 'today' ? 'Today' : 'This Week')}
                        <FlatList
                            data={item.data}
                            renderItem={renderItem}
                            keyExtractor={(notification) => notification.key}
                        />
                    </>
                )}
                keyExtractor={(item) => item.key}
                contentContainerStyle={styles.flatListContent}
            />
            <TabBar isLoggedIn={!!token} currentPage="Notifications" userId={user?.user_id || null} />
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
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Arimo',
        marginVertical: 12,
        fontWeight: '700',
        color: '#211B17',
        backgroundColor: '#C1855F',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    flatListContent: {
        paddingBottom: 16,
    },
});