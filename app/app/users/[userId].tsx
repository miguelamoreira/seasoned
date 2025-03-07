import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useUserContext } from '@/contexts/UserContext';

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
import { fetchComparisonGenres } from '@/api/genresApi';

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
    const { user, token } = useUserContext();
    const { userId: userIdParam } = useLocalSearchParams<{ userId: string }>();
    const router = useRouter();

    const [type, setType] = useState<'profile' | 'edit'>('profile');
    const [activeTab, setActiveTab] = useState<string>('header');
    const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [badges, setBadges] = useState<any[]>([]);
    const [ratingsGroupedByScore, setRatingsGroupedByScore] = useState<RatingsGroupedByScore>({});
    const [genres, setGenres] = useState<any[]>([]);

    useEffect(() => {
        const initialize = async () => {
            try {
                const userId = userIdParam ? parseInt(userIdParam, 10) : user?.user_id;

                if (userId) {
                    setIsViewingOtherUser(userId !== user?.user_id);

                    const [userDataResponse, badgesResponse, ratingsResponse, genresResponse] = await Promise.all([
                        findUserById(userId),
                        fetchBadges(userId),
                        fetchRatingsGroupedByScore(userId),
                        fetchComparisonGenres(userId),
                    ]);

                    setUserData(userDataResponse);

                    const sortedBadges = badgesResponse.sort((a: { earned: boolean; }, b: { earned: boolean; }) => (a.earned === b.earned ? 0 : a.earned ? -1 : 1));
                    setBadges(sortedBadges);

                    setRatingsGroupedByScore(ratingsResponse);

                    const sortedGenres = genresResponse.data?.sort((a: { selected: boolean; }, b: { selected: boolean; }) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1)) || [];
                    setGenres(sortedGenres);
                }
            } catch (error) {
                console.error('Error initializing user profile:', error);
            }
        };

        initialize();
    }, [userIdParam, user]);

    const handleSaveProfile = (updatedUsername: string) => {
        if (userData) {
            const updatedUserData = { ...userData, username: updatedUsername };
            setUserData(updatedUserData);
            setType('profile');
        }
    };

    const handleGenresChange = (updatedGenres: { genre_id: number; genre_name: string; selected: boolean }[]) => {
        setGenres(updatedGenres); 
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
                            currentUser={user?.user_id ?? -1}
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
                return <ProfileFavourites type={type} shows={userData?.favouriteSeries ?? []} onAddShow={handleAddShow} onRemoveShow={handleRemoveShow} userId={user?.user_id ?? -1} />;
            case 'genres':
                return <ProfileGenres genres={genres} type={type} userId={user?.user_id ?? -1} onGenresChange={handleGenresChange} />;
            case 'badges':
                return <ProfileBadges badges={badges} type={type} userId={userIdParam ? parseInt(userIdParam, 10) : -1} currentUserId={user?.user_id ?? -1} badgesVisibility={userData?.badgesVisibility ?? true} />;
            case 'ratings':
                const ratingsArray = Object.entries(ratingsGroupedByScore);
                const totalRatings = ratingsArray.reduce((acc, [score, count]) => {
                    return acc + parseInt(score) * count;
                }, 0);
                const totalReviews = ratingsArray.reduce((acc, [, count]) => acc + count, 0);
                const averageRating = totalReviews > 0 ? totalRatings / totalReviews : 0;
                const counts = ratingsArray.map(([_, count]) => count);
                
                return <RatingDisplay type={type} ratings={counts} average={averageRating} />;
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
            <TabBar isLoggedIn={!!token} currentPage="Profile" userId={user?.user_id ?? -1} />
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