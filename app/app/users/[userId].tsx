import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OptionsTab from '@/components/OptionsTab';
import ProfileHeader from '@/components/users/ProfileHeader';
import OtherUserHeader from '@/components/users/OtherUserHeader';
import ProfileStats from '@/components/users/ProfileStats';
import ProfileFavourites from '@/components/users/ProfileFavourites';
import ProfileGenres from '@/components/users/ProfileGenres';
import ProfileBadges from '@/components/users/ProfileBadges';
import RatingDisplay from '@/components/reviews/RatingsDisplay';
import ProfileOptions from '@/components/users/ProfileOptions';
import TabBar from '@/components/TabBar';

import { fetchBadges } from '@/api/badgesApi';
import { findUserById } from '@/api/userApi';
import { fetchRatingsGroupedByScore } from '@/api/reviewsApi';

interface UserStatsData {
    episodes: number;
    months: number;
    weeks: number;
    days: number;
    thisYearEpisodes: number;
}

interface UserProfile {
    id: number;
    username: string;
    followers: number;
    following: number;
    avatar: string;
    statsData: UserStatsData;
    favouriteSeries: any[];
    preferredGenres: any[];
    badgesVisibility: boolean;
}

interface RatingsGroupedByScore {
    [key: string]: number;
}

export default function UserProfileScreen() {
    const { userId: userIdParam } = useLocalSearchParams<{ userId: string }>(); 
    const router = useRouter();

    const [type, setType] = useState<'profile' | 'edit'>('profile');
    const [activeTab, setActiveTab] = useState<string>('header');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [badges, setBadges] = useState<any[]>([]);
    const [isViewingOtherUser, setIsViewingOtherUser] = useState(false); 
    const [ratingsGroupedByScore, setRatingsGroupedByScore] = useState<RatingsGroupedByScore>({});

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const id = await AsyncStorage.getItem('userId');
                if (token && token !== '') {
                    setIsLoggedIn(true);
                    setLoggedInUserId(id ? parseInt(id) : null);
                } else {
                    setIsLoggedIn(false);
                    setLoggedInUserId(null);
                }
            } catch (error) {
                console.log("Error checking login status:", error);
                setIsLoggedIn(false);
                setLoggedInUserId(null);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (userIdParam) {
            const userIdFromParams = parseInt(userIdParam);
            setIsViewingOtherUser(userIdFromParams !== loggedInUserId); 
            findUserById(userIdFromParams)
                .then((fetchedUserData) => {
                    setUserData(fetchedUserData);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userIdParam, loggedInUserId]);

    useEffect(() => {
        if (userIdParam) {
            fetchBadges(userIdParam) 
                .then((fetchedBadges) => {
                    const sortedBadges = fetchedBadges.sort((a: { earned: boolean; }, b: { earned: boolean; }) => {
                        if (a.earned === b.earned) return 0;
                        return a.earned ? -1 : 1;
                    });
                    setBadges(sortedBadges);
                })
                .catch((error) => {
                    console.error('Error fetching badges:', error);
                });
        }
    }, [userIdParam]);

    useEffect(() => {
        if (userIdParam) {
            fetchRatingsGroupedByScore(userIdParam)
                .then((ratingsData) => {
                    setRatingsGroupedByScore(ratingsData);
                    console.log('ratingssss: ', ratingsData)
                })
                .catch((error) => {
                    console.error('Error fetching ratings grouped by score:', error);
                });
        }
    }, [userIdParam]);

    const handleSaveProfile = (updatedUsername: string) => {
        if (userData) {
            const updatedUserData = { ...userData, username: updatedUsername };
            setUserData(updatedUserData);
            setType('profile');
        }
    };

    const handleEditProfile = () => {
        setType('edit');
    };

    const handleAddShow = () => {
        router.push(`/users/${userIdParam}/favourites`);
    };

    const handleRemoveShow = (seriesId: number) => {
        if (userData) {
            const updatedFavouriteSeries = userData.favouriteSeries.filter(show => show.series.series_api_id !== seriesId);
            setUserData({
                ...userData,
                favouriteSeries: updatedFavouriteSeries,
            });
        }
    };

    const handleTabSelect = (label: string, navigateTo: string) => {
        router.push({
            pathname: navigateTo as any,
            params: { activeTab: label },
        });
    };

    const sections = ['header', 'stats', 'favourites', 'genres', 'badges', 'ratings', 'userShows', 'userActivity'];

    const userShowsOptions = [
        { label: 'following', action: () => handleTabSelect('Following', `/users/${userIdParam}/usersShows`) },
        { label: 'watched', action: () => handleTabSelect('Watched', `/users/${userIdParam}/usersShows`) },
        { label: 'watchlist', action: () => handleTabSelect('Watchlist', `/users/${userIdParam}/usersShows`) },
        { label: 'dropped', action: () => handleTabSelect('Dropped', `/users/${userIdParam}/usersShows`) },
    ];

    const userActivityOptions = [
        { label: 'reviews', action: () => handleTabSelect('Reviews', `/users/${userIdParam}/usersActivity`) },
        { label: 'likes', action: () => handleTabSelect('Likes', `/users/${userIdParam}/usersActivity`) },
    ];

    const renderItem = ({ item }: { item: string }) => {
        if (item === 'header') {
            if (isViewingOtherUser) {
                return (
                    <>
                        <OptionsTab type="back" onBackPress={() => router.push('/homepage')} />
                        <OtherUserHeader
                            username={userData?.username ?? ''}
                            followers={userData?.followers ?? 0}
                            following={userData?.following ?? 0}
                            profileImage={userData?.avatar ?? ''}
                            currentUser={String(loggedInUserId) ?? -1}
                            userId={userData?.id ?? -1}
                        />
                    </>
                );
            } else {
                return (
                    <ProfileHeader
                        username={userData?.username ?? ''}
                        followers={userData?.followers ?? 0}
                        following={userData?.following ?? 0}
                        profileImage={userData?.avatar ?? ''}
                        userId={userData?.id ?? -1}
                        onEditProfile={handleEditProfile}
                        onSettingsPress={() => router.push(`/users/${userIdParam}/configurations`)}
                        onQRPress={() => router.push(`/users/${userIdParam}/qrcode`)}
                        type={type}
                        onSaveProfile={handleSaveProfile}
                    />
                );
            }
        }

        switch (item) {
            case 'stats':
                return <ProfileStats stats={userData?.statsData ?? { episodes: 0, months: 0, weeks: 0, days: 0, thisYearEpisodes: 0 }} type={type} />;
            case 'favourites':
                return <ProfileFavourites type={type} shows={userData?.favouriteSeries ?? []} onAddShow={handleAddShow} onRemoveShow={handleRemoveShow} userId={Number(loggedInUserId)}/>;
            case 'genres':
                return <ProfileGenres genres={userData?.preferredGenres ?? []} type={type} />;
            case 'badges':
                return <ProfileBadges badges={badges} type={type} userId={Number(userIdParam) ?? -1} currentUserId={loggedInUserId ?? -1} badgesVisibility={userData?.badgesVisibility ?? true}/>;
            case 'ratings':
                const ratingsArray = Object.values(ratingsGroupedByScore);
                const totalRatings = ratingsArray.reduce((acc, curr) => acc + curr, 0);
                const averageRating = ratingsArray.length > 0 ? totalRatings / ratingsArray.length : 0;
    
                return <RatingDisplay type={type} ratings={ratingsArray} average={averageRating} />;
            case 'userShows':
                return <ProfileOptions title="User's Shows" options={userShowsOptions} type={type} />;
            case 'userActivity':
                return <ProfileOptions title="User's Activity" options={userActivityOptions} type={type} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
            <TabBar isLoggedIn={isLoggedIn} currentPage="Profile" userId={loggedInUserId} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
    },
    flatListContent: {
        paddingBottom: 72,
    },
});