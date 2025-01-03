import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { removeRelationship } from '@/api/relationshipsApi';

export type User = {
    name: any;
    user_id: number;
    avatar: string;
    username: string;
    following?: boolean;
    type: 'user';
};

type UsersProps = {
    users: User[];
    currentUser: string; 
    type: 'search' | 'following' | 'followers';
};

export default function UsersDisplay({ users, currentUser, type }: UsersProps) {
    const [updatedUsers, setUpdatedUsers] = useState(users);
    const [currentType, setCurrentType] = useState(type);
    const router = useRouter();
    const { userId } = useLocalSearchParams<{ userId: string }>();
    
    useEffect(() => {
        setUpdatedUsers(users);
    }, [users]);

    const handleFollowUnfollow = (userId: number) => {
        setUpdatedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.user_id === userId ? { ...user, following: !user.following } : user
            )
        );
    };

    const handleUnfollow = async (followingId: number) => {
        try {
            const user1_id = Number(currentUser);
            const user2_id = followingId;
            const actionType = 'following';
            await removeRelationship(user1_id, user2_id, actionType);
            setUpdatedUsers(prevUsers => prevUsers.filter(user => user.user_id !== followingId))
        } catch (error) {
            console.error('Error removing following:', error);
        }
    };

    const handleRemoveFollower = async (followerId: number) => {
        try {
            const user1_id = Number(currentUser);
            const user2_id = followerId;
            const actionType = 'follower';
            await removeRelationship(user1_id, user2_id, actionType);
            setUpdatedUsers(prevUsers => prevUsers.filter(user => user.user_id !== followerId));
        } catch (error) {
            console.error('Error removing follower:', error);
        }
    };

    const renderUser = ({ item }: { item: User }) => {
        const isCurrentUser = Number(currentUser) === item.user_id;
        const isLoggedUsersPage = currentUser === userId;

        return (
            <TouchableOpacity style={styles.userContainer} onPress={() => router.push(`/users/${item.user_id}`)}>
                <View style={styles.userDetails}>
                    <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                        <Image source={{ uri: item.avatar }} style={styles.userImage} />
                    </Shadow>
                    <Text style={styles.userName}>{item.name}</Text>
                </View>
                <View style={styles.userOptions}>
                    {currentType === 'followers' && isLoggedUsersPage && !isCurrentUser && (
                        <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                            <TouchableOpacity
                                onPress={() => handleRemoveFollower(item.user_id)}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Remove</Text>
                            </TouchableOpacity>
                        </Shadow>
                    )}
                    {currentType === 'following' && isLoggedUsersPage && !isCurrentUser && (
                        <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                            <TouchableOpacity
                                onPress={() => handleUnfollow(item.user_id)}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Unfollow</Text>
                            </TouchableOpacity>
                        </Shadow>
                    )}
                    {currentType === 'followers' && !isLoggedUsersPage && !isCurrentUser && (
                        <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                            <TouchableOpacity
                                onPress={() => handleFollowUnfollow(item.user_id)}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    {item.following ? 'Unfollow' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        </Shadow>
                    )}
                    {currentType === 'following' && !isLoggedUsersPage && !isCurrentUser && (
                        <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                            <TouchableOpacity
                                onPress={() => handleFollowUnfollow(item.user_id)}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    {item.following ? 'Unfollow' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        </Shadow>
                    )}
                    {(currentType === 'followers' || currentType === 'following') && isCurrentUser && (
                        <View style={styles.noButtonContainer}></View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={updatedUsers}
            keyExtractor={(item) => `${item.user_id}`}
            renderItem={renderUser}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        marginBottom: 20,
        color: '#211B17',
        fontFamily: 'Arimo',
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        paddingVertical: 8,
    },
    userDetails: {
        flexDirection: 'row',
        gap: 20,
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#211B17',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    userOptions: {
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#D8A84E',
        width: 92,
        paddingVertical: 2,
        borderRadius: 8,
        borderColor: '#211B17',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Arimo',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    noButtonContainer: {
        width: 92,
        height: 32,
    },
});