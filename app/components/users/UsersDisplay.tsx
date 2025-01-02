import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Shadow } from 'react-native-shadow-2';

export type User = {
    name: any;
    id: number;
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

    useEffect(() => {
        setUpdatedUsers(users);
    }, [users]);

    const handleFollowUnfollow = (userId: number) => {
        setUpdatedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, following: !user.following } : user
            )
        );
        
        setCurrentType((prevType) => (prevType === 'following' ? 'followers' : 'following'));
    };

    const handleRemoveFollower = (followerId: number) => {
        setUpdatedUsers((prevUsers) => prevUsers.filter((user) => user.id !== followerId));
    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userContainer}>
            <View style={styles.userDetails}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <Image source={{ uri: item.avatar }} style={styles.userImage} />
                </Shadow>
                <Text style={styles.userName}>{item.name}</Text>
            </View>
            <View style={styles.userOptions}>
                {currentType === 'search' && (
                    <TouchableOpacity onPress={() => handleFollowUnfollow(item.id)}>
                        <Icon
                            name={item.following ? 'user-times' : 'user-plus'}
                            size={20}
                            color="#D8A84E"
                        />
                    </TouchableOpacity>
                )}
                {currentType === 'followers' && (
                    <>
                        {currentUser && Number(currentUser) !== item.id ? (
                            <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                                <TouchableOpacity
                                    onPress={() => handleRemoveFollower(item.id)}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Remove</Text>
                                </TouchableOpacity>
                            </Shadow>
                        ) : (
                            <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                                <TouchableOpacity
                                    onPress={() => handleFollowUnfollow(item.id)}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>
                                        {item.following ? 'Unfollow' : 'Follow'}
                                    </Text>
                                </TouchableOpacity>
                            </Shadow>
                        )}
                    </>
                )}
                { currentType === 'following' && (
                    <Shadow distance={1} startColor={'#211B17'} offset={[2, 4]}>
                        <TouchableOpacity
                            onPress={() => handleFollowUnfollow(item.id)}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                {item.following ? 'Unfollow' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                    </Shadow>
                )}
            </View>
        </View>
    );

    return (
        <FlatList
            data={updatedUsers}
            keyExtractor={(item) => `${item.id}`}
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
});
