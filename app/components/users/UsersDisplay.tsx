import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Shadow } from 'react-native-shadow-2';

export type User = {
    id: number;
    image: string;
    username: string;
    following?: boolean;
    type: 'user';
};

type UsersProps = {
    users: User[];
    currentUser: User | null;
    type: 'search' | 'profile';
};

export default function UsersDisplay({ users, currentUser, type }: UsersProps) {
    const [updatedUsers, setUpdatedUsers] = useState(users);

    useEffect(() => {
        setUpdatedUsers(users);
    }, [users]);

    const handleFollowUnfollow = (userId: number) => {
        setUpdatedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, following: !user.following } : user
            )
        );
    };

    const handleRemoveFollower = (followerId: number) => {
        setUpdatedUsers((prevUsers) => prevUsers.filter((user) => user.id !== followerId));
    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userContainer}>
            <View style={styles.userDetails}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <Image source={{ uri: item.image }} style={styles.userImage} />
                </Shadow>
                <Text style={styles.userName}>{item.username}</Text>
            </View>
            <View style={styles.userOptions}>
                {type === 'search' && (
                    <TouchableOpacity onPress={() => handleFollowUnfollow(item.id)}>
                        <Icon
                            name={item.following ? 'user-times' : 'user-plus'}
                            size={20}
                            color="#D8A84E"
                        />
                    </TouchableOpacity>
                )}
                {type === 'profile' && (
                    <>
                        {currentUser && currentUser.id === item.id ? (
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
