import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OptionsTab from '@/components/OptionsTab';
import TabMenu from '@/components/TabMenu';
import SearchBar from '@/components/search/SearchBar';
import UsersDisplay, { User } from '@/components/users/UsersDisplay';
import EmptyState from '@/components/EmptyState';

import { getFollowingUsers, getFollowers } from '@/api/relationshipsApi';

export default function FollowersFollowingScreen() {
    const { userId, activeTab: initialActiveTab } = useLocalSearchParams<{ userId: string; activeTab: string }>();
    
    const userIdString = Number(userId);
    const router = useRouter();

    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<User[]>([]); 
    const [activeTab, setActiveTab] = useState<'Followers' | 'Following'>(
        (initialActiveTab as 'Followers' | 'Following') || 'Followers'
    );
    const [followersData, setFollowersData] = useState<User[]>([]);
    const [followingData, setFollowingData] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<number | null>(null);

    const handleSearchFocus = () => setIsFocused(true);
    const handleSearchBlur = () => setIsFocused(false);
    const handleSearchChange = (text: string) => setSearchText(text);

    const handleTabPress = (tab: string) => {
        setActiveTab(tab as 'Followers' | 'Following');
    };

    const fetchFollowers = async () => {
        const data = await getFollowers(userIdString);
        setFollowersData(data);
    };

    const fetchFollowing = async () => {
        const data = await getFollowingUsers(userIdString);
        setFollowingData(data);
    };

    useEffect(() => {
        if (activeTab === 'Followers') {
            fetchFollowers();
        } else {
            fetchFollowing();
        }
    }, [activeTab]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const loggedInUserId = await AsyncStorage.getItem('userId');
            setCurrentUser(loggedInUserId ? Number(loggedInUserId) : null);
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const data = activeTab === 'Followers' ? followersData : followingData;
        const filtered = data.filter((user) =>
            user.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchText, activeTab, followersData, followingData]);

    const shouldShowEmptyState = (data: User[], type: 'Followers' | 'Following') => {
        return data.length === 0 && activeTab === type;
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.push(`/users/${userIdString}`)} />

            <TabMenu
                tabs={[
                    { label: 'Followers', icon: 'people' },
                    { label: 'Following', icon: 'person-add' },
                ]}
                activeTab={activeTab}
                onTabPress={handleTabPress}
                isLoggedIn={true}
            />

            <View style={styles.searchContainer}>
                <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} onChange={handleSearchChange} value={searchText} />
            </View>

            <View style={styles.listContainer}>
                {activeTab === 'Followers' && followersData.length > 0 ? (
                    <UsersDisplay
                        users={filteredData}
                        currentUser={currentUser?.toString() || ''} 
                        type="followers"
                    />
                ) : shouldShowEmptyState(followersData, 'Followers') ? (
                    <EmptyState type="noFollowers" />
                ) : null}

                {activeTab === 'Following' && followingData.length > 0 ? (
                    <UsersDisplay
                        users={filteredData}
                        currentUser={currentUser?.toString() || ''}
                        type="following"
                    />
                ) : shouldShowEmptyState(followingData, 'Following') ? (
                    <EmptyState type="noFollowing" />
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingTop: 42,
        paddingBottom: 60,
    },
    searchContainer: {
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    noDataText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 16,
    },
});