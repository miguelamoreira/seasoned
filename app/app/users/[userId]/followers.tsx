import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';
import TabMenu from '@/components/TabMenu';
import SearchBar from '@/components/search/SearchBar';
import UsersDisplay, { User } from '@/components/users/UsersDisplay';

import { getFollowingUsers, getFollowers } from '@/api/relationshipsApi'

const followers: User[] = [
    { id: 1, image: 'https://via.placeholder.com/80', username: 'Michael_24', type: 'user' },
    { id: 2, image: 'https://via.placeholder.com/80', username: 'Julie.007', type: 'user' },
    { id: 3, image: 'https://via.placeholder.com/80', username: 'the_series_killer24', type: 'user' },
    { id: 4, image: 'https://via.placeholder.com/80', username: 'mia_anderson', type: 'user' },
    { id: 5, image: 'https://via.placeholder.com/80', username: 'dwaynepete', type: 'user' },
];

const following: User[] = [
    { id: 1, image: 'https://via.placeholder.com/80', username: 'padillajes', following: true, type: 'user' },
    { id: 2, image: 'https://via.placeholder.com/80', username: 'annacole', following: true, type: 'user' },
    { id: 3, image: 'https://via.placeholder.com/80', username: 'pgraham', following: true, type: 'user' },
    { id: 4, image: 'https://via.placeholder.com/80', username: 'jason78', following: true, type: 'user' },
    { id: 5, image: 'https://via.placeholder.com/80', username: 'courtneybe', following: true, type: 'user' },
];

export default function FollowersFollowingScreen() {
    const { userId, activeTab: initialActiveTab } = useLocalSearchParams<{ userId: string; activeTab: string }>();
    const router = useRouter();

    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<User[]>([]); 
    const [activeTab, setActiveTab] = useState<'Followers' | 'Following'>(
        (initialActiveTab as 'Followers' | 'Following') || 'Followers'
    );

    const handleSearchFocus = () => setIsFocused(true);
    const handleSearchBlur = () => setIsFocused(false);
    const handleSearchChange = (text: string) => setSearchText(text);

    const handleTabPress = (tab: string) => {
        console.log('Tab Pressed:', tab); 
        setActiveTab(tab as 'Followers' | 'Following');
    };

    useEffect(() => {
        console.log('Active Tab:', activeTab);
        console.log('Search Text:', searchText);

        const data = activeTab === 'Followers' ? followers : following;
        console.log('Filtered Data Source:', data);

        const filtered = data.filter((user) =>
            user.username.toLowerCase().includes(searchText.toLowerCase())
        );
        console.log('Filtered Data:', filtered);

        setFilteredData(filtered);
    }, [activeTab, searchText]);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type="back" onBackPress={() => router.back()} />

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
                <SearchBar onFocus={handleSearchFocus} onBlur={handleSearchBlur} onChange={handleSearchChange} />
            </View>

            <View style={styles.listContainer}>
                {filteredData.length > 0 ? (
                    <UsersDisplay
                        users={filteredData}
                        currentUser={null} 
                        type="profile" 
                    />
                ) : (
                    <Text style={styles.noDataText}>No users found</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingHorizontal: 16,
        paddingTop: 42,
        paddingBottom: 60,
    },
    searchContainer: {
        marginVertical: 16,
    },
    listContainer: {
        flex: 1,
    },
    noDataText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});
