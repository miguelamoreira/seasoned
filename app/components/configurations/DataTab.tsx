import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { findUserById, updateUserData, deleteUserById } from '@/api/userApi';

export default function DataTab() {
    const router = useRouter();
    const { userId: userIdParam } = useLocalSearchParams<{ userId: string }>(); 
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSucessMessage] = useState("");

    useEffect(() => {
        if (userIdParam) {
            const userIdFromParams = parseInt(userIdParam);
            findUserById(userIdFromParams)
                .then((fetchedUserData) => {
                    setEmail(fetchedUserData.email); 
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userIdParam]);

    const handleSave = async () => {
        try {
            const userIdFromParams = parseInt(userIdParam);
            await updateUserData(userIdFromParams, email, currentPassword, newPassword, confirmPassword);
            
            setErrorMessage("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setSucessMessage("Your data has been successfully updated!")
        } catch (error) {
            setErrorMessage("Failed to update user data. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const userIdFromParams = parseInt(userIdParam);
            await deleteUserById(userIdFromParams);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userId');
            router.push('/'); 
        } catch (error) {
            console.error('Error deleting account: ', error)
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userId');
            router.push('/');
        } catch (error) {
            console.error('Error logging out: ', error)
        }
    };

    return (
        <View>
            <Text style={styles.heading}>Personal data</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#FFF4E080"
                    />
                </Shadow>
            </View>

            <Text style={styles.heading}>Change password</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="*****"
                        placeholderTextColor="#FFF4E080"
                    />
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="*****"
                        placeholderTextColor="#FFF4E080"
                    />
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="*****"
                        placeholderTextColor="#FFF4E080"
                    />
                </Shadow>
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <View style={styles.buttonsContainer}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TouchableOpacity style={[styles.button, styles.deleteAccountButton]} onPress={handleDeleteAccount}>
                        <Text style={styles.buttonText}>Delete account</Text>
                    </TouchableOpacity>
                </Shadow>

                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </Shadow>
            </View>

            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <TouchableOpacity style={[styles.logoutButton]} activeOpacity={0.9} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </Shadow>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        fontFamily: 'DMSerifText',
        marginVertical: 16,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
        fontFamily: 'Arimo',
    },
    input: {
        width: 378,
        height: 48,
        paddingHorizontal: 12,
        backgroundColor: '#403127',
        borderRadius: 8,
        color: '#FFF4E0',
        fontSize: 16,
        fontFamily: 'Arimo',
        textAlignVertical: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginVertical: 24,
    },
    button: {
        borderWidth: 2,
        borderColor: '#211B17',
        borderRadius: 8,
        height: 40, 
        justifyContent: 'center',
    },
    buttonText: {
        color: '#211B17',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Arimo',
        paddingVertical: 8,
    },
    deleteAccountButton: {
        backgroundColor: '#EE6363',
        width: 180,
        height: 48,
    },
    saveButton: {
        backgroundColor: '#D8A84E',
        width: 180,
        height: 48,
    },
    logoutButton: {
        backgroundColor: '#EBCE97',
        borderWidth: 2,
        borderColor: '#211B17',
        borderRadius: 8,
        width: 90,
    },
    errorText: {
        color: '#EE6363', 
        fontSize: 14,
        fontFamily: 'Arimo',
        marginTop: 10,
        textAlign: 'center',
    },
    successText: {
        color: '#82AA59', 
        fontSize: 14,
        fontFamily: 'Arimo',
        marginTop: 10,
        textAlign: 'center',
    }
});