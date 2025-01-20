import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View } from 'react-native';
import { useUserContext } from '@/contexts/UserContext';
import TabBar from '@/components/TabBar';
import NotificationCard from '@/components/NotificationCard';
import EmptyState from '@/components/EmptyState';

import { fetchNotifications } from '@/api/notificationsApi';

interface Notification {
    notification_id: number;
    user_id: number;
    notificationType: string;
    variant: "newComments" | "earnedBadges" | "newFollowers" | "newLikes";
    message: string;
    date: string;
    review_id: number | null;
    review?: {
        review: string;
        rating?: number;
    };
    comment?: {
        review: string;
    }
}

interface NotificationsData {
    today: Notification[];
    thisWeek: Notification[];
}

declare global {
    interface Date {
        getWeek(): number;
    }
}

Date.prototype.getWeek = function () {
    const startDate = new Date(this.getFullYear(), 0, 1);
    const days = Math.floor((this.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
};

const isToday = (dateString: string): boolean => {
    const notificationDate = new Date(dateString);
    const today = new Date();
    return (
        notificationDate.getDate() === today.getDate() &&
        notificationDate.getMonth() === today.getMonth() &&
        notificationDate.getFullYear() === today.getFullYear()
    );
};

const isThisWeek = (dateString: string): boolean => {
    const notificationDate = new Date(dateString);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - notificationDate.getTime()) / (1000 * 3600 * 24));
    return (
        diffDays > 0 && diffDays <= 7 && notificationDate.getWeek() === today.getWeek()
    );
};

export default function NotificationsScreen() {
    const { user, token } = useUserContext();
    const [notificationsData, setNotificationsData] = useState<NotificationsData>({
        today: [],
        thisWeek: [],
    });

    useEffect(() => {
        const loadNotifications = async () => {
            if (user?.user_id && token) {
                try {
                    const response = await fetchNotifications(user?.user_id);
    
                    const today: Notification[] = [];
                    const thisWeek: Notification[] = [];
    
                    response.data.forEach((notification: Notification) => {
                        if (notification.variant === 'newLikes' && notification.review) {
                            const formattedReview = {
                                review_id: notification.review_id,
                                id: notification.review_id,
                                rating: notification.review.rating,
                                review: notification.review.review,
                            };
    
                            notification.review = formattedReview;
                            
                        }

                        if (notification.variant === 'newComments' && notification.comment) {
                            const formattedComment = {
                                review: notification.comment.review
                            };
    
                            notification.comment = formattedComment;
                        }
    
                        if (isToday(notification.date)) {
                            today.push(notification);
                        } else if (isThisWeek(notification.date)) {
                            thisWeek.push(notification);
                        }
                    });

                    setNotificationsData({
                        today,
                        thisWeek,
                    });

                } catch (error) {
                    console.error('Failed to load notifications:', error);
                }
            }
        };
    
        loadNotifications();
    
    }, [user, token]);

    const renderItem = ({ item }: { item: Notification }) => (
        <NotificationCard
            type={item.notificationType}
            variant={item.variant}
            data={item}
            read={false}
        />
    );

    const renderSectionTitle = (title: string) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );

    const tabData = [
        { key: 'today', data: notificationsData.today },
        { key: 'thisWeek', data: notificationsData.thisWeek },
    ];

    const noNotifications = notificationsData.today.length === 0 && notificationsData.thisWeek.length === 0;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Text style={styles.heading}>Notifications</Text>

            {noNotifications ? (
                <View>
                    <EmptyState type="noNotifs" />
                </View>
            ) : (
                <FlatList
                    data={tabData}
                    renderItem={({ item }) => (
                        <>
                            {renderSectionTitle(item.key === 'today' ? 'Today' : 'This Week')}
                            <FlatList
                                data={item.data}
                                renderItem={renderItem}
                                keyExtractor={(notification) => notification.notification_id.toString()}
                            />
                        </>
                    )}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.flatListContent}
                />
            )}

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