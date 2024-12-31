import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, Image } from 'react-native';
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

import { fetchBadges } from '@/api/badgesApi'

const user = {
  id: 1,
  username: 'joshua31',
  followers: 250,
  following: 500,
  avatar: 'https://via.placeholder.com/100',
  statsData: {
    episodes: 451,
    months: 20,
    weeks: 3,
    days: 4,
    thisYearEpisodes: 50,
  },
  favourites: [
    { id: '1', image: 'https://via.placeholder.com/100' },
    { id: '2', image: 'https://via.placeholder.com/100' },
    { id: '3', image: 'https://via.placeholder.com/100' },
  ],
};

const otherUser = {
  id: 2,
  username: 'another_user',
  followers: 123,
  following: 456,
  avatar: 'https://via.placeholder.com/100',
  statsData: {
    episodes: 302,
    months: 15,
    weeks: 2,
    days: 5,
    thisYearEpisodes: 80,
  },
  favourites: [
    { id: '1', image: 'https://via.placeholder.com/100' },
    { id: '2', image: 'https://via.placeholder.com/100' },
    { id: '3', image: 'https://via.placeholder.com/100' },
  ],
};

const userGenres = ['Drama', 'Action', 'Thriller', 'Comedy', 'Adventure', 'Fantasy'];

export default function UserProfileScreen() {
    const router = useRouter();
    const [type, setType] = useState<'profile' | 'edit'>('profile');
    const [activeTab, setActiveTab] = useState<string>('header');
    const [isViewingOtherUser, setIsViewingOtherUser] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [userData, setUserData] = useState(null);
    const [currentPage, setCurrentPage] = useState<string>('Profile');
    const [badges, setBadges] = useState([]);

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

    const handleSaveProfile = () => {
      setType('profile');
    };

    const handleEditProfile = () => {
      setType('edit');
    };

    const toggleViewOtherUser = (id: number) => {
      router.push(`/users/${id}`);
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

    const sections = [ 'header', 'stats', 'favourites', 'genres', 'badges', 'ratings', 'userShows', 'userActivity' ];

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
              <OptionsTab type="back" onBackPress={() => router.back()}></OptionsTab>
              <OtherUserHeader username={otherUser.username} followers={otherUser.followers} following={otherUser.following} profileImage={otherUser.avatar}
                onFollowToggle={() => console.log('Follow/Unfollow toggled')} userId={otherUser.id}
              />
            </>
          );
        } else {
          return (
            <ProfileHeader username={user.username} followers={user.followers} following={user.following} profileImage={user.avatar} onEditProfile={handleEditProfile}
              onSettingsPress={() => router.push(`/users/${userId}/configurations`)} onQRPress={() => router.push(`/users/${userId}/qrcode`)} type={type} onSaveProfile={handleSaveProfile}
            />
          );
        }
      }

      switch (item) {
        case 'stats':
          return <ProfileStats stats={user.statsData} type={type} />;
        case 'favourites':
          return <ProfileFavourites type={type} shows={user.favourites} onAddShow={handleAddShow} onRemoveShow={(id) => console.log(`Remove Show with ID: ${id}`)}/>;
        case 'genres':
          return <ProfileGenres genres={userGenres} type={type} />;
        case 'badges':
          return <ProfileBadges badges={badges} type={type} userId={userId ?? -1}/>;
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
        <FlatList data={sections} renderItem={renderItem} keyExtractor={(item) => item} contentContainerStyle={styles.flatListContent} showsVerticalScrollIndicator={false}/>
        <TabBar isLoggedIn={isLoggedIn} currentPage={currentPage} userId={userId} />
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