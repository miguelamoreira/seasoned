import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
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

interface UserStatsData {
    episodes: number;
    months: number;
    weeks: number;
    days: number;
    thisYearEpisodes: number;
}

interface FavouriteShow {
    id: string;
    image: string;
}

interface UserProfile {
    id: number;
    username: string;
    followers: number;
    following: number;
    avatar: string;
    statsData: UserStatsData;
    favourites: FavouriteShow[];
}

const userGenres = ['Drama', 'Action', 'Thriller', 'Comedy', 'Adventure', 'Fantasy'];

const userFavourites: FavouriteShow[] = [
    { id: '1', image: 'https://via.placeholder.com/100' },
    { id: '2', image: 'https://via.placeholder.com/100' },
    { id: '3', image: 'https://via.placeholder.com/100' },
];

export default function UserProfileScreen() {
    const router = useRouter();
    const [type, setType] = useState<'profile' | 'edit'>('profile');
    const [activeTab, setActiveTab] = useState<string>('header');
    const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [badges, setBadges] = useState<any[]>([]);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const id = await AsyncStorage.getItem('userId');
                if (token && token !== '') {
                    setIsLoggedIn(true);
                    setUserId(id ? parseInt(id) : null);
                } else {
                    setIsLoggedIn(false);
                    setUserId(null);
                }
            } catch (error) {
                console.log("Error checking login status:", error);
                setIsLoggedIn(false);
                setUserId(null);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (userId) {
            findUserById(userId)
                .then((fetchedUserData) => {
                    console.log('user data: ', fetchedUserData);
                    setUserData(fetchedUserData);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchBadges(userId)
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
    },  [userId]);

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
      router.push(`/users/${userId}/favourites`);
    };

    const handleTabSelect = (label: string, navigateTo: string) => {
      router.push({
        pathname: navigateTo as any,
        params: { activeTab: label },
      });
    };

    const sections = ['header', 'stats', 'favourites', 'genres', 'badges', 'ratings', 'userShows', 'userActivity'];

    const userShowsOptions = [
      { label: 'following', action: () => handleTabSelect('Following', `/users/${userId}/usersShows`) },
      { label: 'watched', action: () => handleTabSelect('Watched', `/users/${userId}/usersShows`) },
      { label: 'watchlist', action: () => handleTabSelect('Watchlist', `/users/${userId}/usersShows`) },
      { label: 'dropped', action: () => handleTabSelect('Dropped', `/users/${userId}/usersShows`) },
    ];

    const userActivityOptions = [
      { label: 'reviews', action: () => handleTabSelect('Reviews', `/users/${userId}/usersActivity`) },
      { label: 'likes', action: () => handleTabSelect('Likes', `/users/${userId}/usersActivity`) },
    ];

    const renderItem = ({ item }: { item: string }) => {
      if (item === 'header') {
        if (isViewingOtherUser) {
          return (
            <>
              <OptionsTab type="back" onBackPress={() => router.back()} />
              <OtherUserHeader 
                username={userData?.username ?? ''} 
                followers={userData?.followers ?? 0} 
                following={userData?.following ?? 0} 
                profileImage={userData?.avatar ?? ''} 
                onFollowToggle={() => console.log('Follow/Unfollow toggled')} 
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
              onSettingsPress={() => router.push(`/users/${userId}/configurations`)} 
              onQRPress={() => router.push(`/users/${userId}/qrcode`)} 
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
          return <ProfileFavourites type={type} shows={userFavourites} onAddShow={handleAddShow} onRemoveShow={(id) => console.log(`Remove Show with ID: ${id}`)} />;
        case 'genres':
          return <ProfileGenres genres={userGenres} type={type} />;
        case 'badges':
          return <ProfileBadges badges={badges} type={type} userId={userId ?? -1} currentUserId={userId ?? -1} />;
        case 'ratings':
          return <RatingDisplay type={type} ratings={[1, 3, 5, 15, 6]} average={4.5} />;
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
        <TabBar isLoggedIn={isLoggedIn} currentPage="Profile" userId={userId} />
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