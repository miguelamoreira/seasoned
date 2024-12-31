import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter } from 'expo-router';

type OtherUserHeaderProps = {
    userId: number;
    username: string;
    followers: number;
    following: number;
    profileImage: string;
    onFollowToggle: () => void;
};

export default function OtherUserHeader({ userId, username, followers, following, profileImage, onFollowToggle }: OtherUserHeaderProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const router = useRouter();

    const handleFollowToggle = () => {
        setIsFollowing((prev) => !prev);
        onFollowToggle();
    };

    const navigateToProfile = () => {
      router.push(`/users/${userId}`); 
    };

    return (
        <View style={styles.headerContainer}>
            <Shadow distance={2} startColor="#211B17" offset={[2, 4]}>
                <Image style={styles.profileImage} source={{ uri: profileImage }} />
            </Shadow>

            <View style={styles.profileInfoContainer}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.followsInfo}>{followers} Followers</Text>
                <Text style={styles.followsInfo}>{following} Following</Text>
            </View>

            <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                <TouchableOpacity style={styles.editButton} onPress={handleFollowToggle}>
                <Text style={styles.editButtonText}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
                </TouchableOpacity>
            </Shadow>
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
    editButton: {
      backgroundColor: '#D8A84E',
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 16,
      borderColor: '#211B17',
      borderWidth: 2,
      alignItems: 'center',
    },
    editButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#211B17',
    },
});
