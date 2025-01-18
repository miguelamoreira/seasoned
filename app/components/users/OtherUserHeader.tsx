import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter } from 'expo-router';
import { useUserContext } from '@/contexts/UserContext';

import { addFollowing, removeRelationship, checkIfFollowing } from '@/api/relationshipsApi';

type OtherUserHeaderProps = {
    userId: number;
    username: string;
    followers: number;
    following: number;
    profileImage: string;
    currentUser: number;
};

export default function OtherUserHeader({ userId, username, followers, following, profileImage, currentUser }: OtherUserHeaderProps) {
    const { user, token } = useUserContext();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(followers);

    const router = useRouter();

    useEffect(() => {
        setFollowersCount(followers || 0);
    }, [followers]);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                if (user && token) {
                    const result = await checkIfFollowing(Number(currentUser), userId);
                    setIsFollowing(result);
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        fetchFollowStatus();
    }, [userId, currentUser]);

    const handleFollow = async () => {
        try {
            await addFollowing(Number(currentUser), userId);
            setIsFollowing(true);
            setFollowersCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error('Error following:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await removeRelationship(Number(currentUser), userId, 'following');
            setIsFollowing(false);
            setFollowersCount((prevCount) => Math.max(0, prevCount - 1));
        } catch (error) {
            console.error('Error unfollowing:', error);
        }
    };

    const handleFollowersPress = (userId: number) => {
      router.push({
          pathname: `/users/${userId}/followers` as any,
          params: { activeTab: 'Followers' },
        });
    };
    
    const handleFollowingPress = (userId: number) => {
        router.push({
            pathname: `/users/${userId}/followers` as any,
            params: { activeTab: 'Following' },
        });
    };

    return (
        <View style={styles.headerContainer}>
            <Shadow distance={2} startColor="#211B17" offset={[2, 4]}>
                <Image style={styles.profileImage} source={{ uri: profileImage }} />
            </Shadow>

            <View style={styles.profileInfoContainer}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.followsInfo} onPress={() => handleFollowersPress(userId)}>{followersCount} Followers</Text>
                <Text style={styles.followsInfo} onPress={() => handleFollowingPress(userId)}>{following} Following</Text>
            </View>

            {user && token && (
                <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                    {isFollowing ? (
                        <TouchableOpacity style={styles.followButton} onPress={handleUnfollow}>
                            <Text style={styles.followButtonText}>Unfollow</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    )}
                </Shadow>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: '#211B17',
    },
    profileInfoContainer: {
      flex: 1,
      marginLeft: 16,
    },
    username: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#211B17',
    },
    followsInfo: {
      fontSize: 14,
      color: '#555',
      marginTop: 2,
    },
    followButton: {
      backgroundColor: '#D8A84E',
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 16,
      borderColor: '#211B17',
      borderWidth: 2,
      alignItems: 'center',
    },
    followButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#211B17',
    },
});
