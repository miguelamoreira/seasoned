import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import ProfileModal from './ProfileModal';
import { updateUsername, updateUserAvatar, deleteUserAvatar } from '@/api/userApi';

type ProfileHeaderProps = {
    type: 'profile' | 'edit';
    username: string;
    followers: number;
    following: number;
    profileImage: string;
    userId: number;
    onEditProfile: () => void;
    onSaveProfile: (newUsername: string) => void;
    onSettingsPress: () => void;
    onQRPress: () => void;
};

export default function ProfileHeader({ type, username, followers, following, profileImage, userId, onEditProfile, onSaveProfile, onSettingsPress, onQRPress }: ProfileHeaderProps) {
    const [editedUsername, setEditedUsername] = useState(username);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false); 
    const [newProfileImage, setNewProfileImage] = useState(profileImage);
    const router = useRouter();

    useEffect(() => {
      setNewProfileImage(profileImage);
    }, [profileImage]);

    const handleSave = async () => {
      try {
          if (editedUsername.trim() === '') {
              onSaveProfile(username);
              return;
          }

          await updateUsername(userId, editedUsername);
          onSaveProfile(editedUsername);
      } catch (error) {
          console.error("Failed to update username:", error);
      }
  };

    const openProfileModal = () => {
      setIsProfileModalVisible(true);
    };

    const closeProfileModal = () => {
      setIsProfileModalVisible(false);
    };

    const pickAvatar = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const avatarUri = result.assets[0].uri;
        if (avatarUri) {
          try {
            const avatarFile = {
              uri: avatarUri,
              type: 'image/jpeg',
              name: 'avatar.jpg',
            };
            const updatedAvatar = await updateUserAvatar(userId, avatarFile);
            console.log('avatar: ', updatedAvatar.data);
            setNewProfileImage(updatedAvatar.data);
            closeProfileModal();
          } catch (error) {
            console.error("Failed to update avatar:", error);
          }
        }
      }
    };

    const handleTakePicture = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            try {
              const avatarFile = {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'avatar.jpg',
              };
              const updatedAvatar = await updateUserAvatar(userId, avatarFile);
              
              setNewProfileImage(updatedAvatar.data);
              closeProfileModal();
            } catch (error) {
              console.error("Failed to update avatar:", error);
            }
        }
    };

    const handleRemoveAvatar = async () => {
        try {
          const updatedAvatar = await deleteUserAvatar(userId);
          setNewProfileImage(updatedAvatar.data);
          closeProfileModal();
        } catch (error) {
          console.error("Failed to remove avatar:", error);
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
        { type === 'edit' ? (
          <>
          <Shadow distance={2} startColor="#211B17" offset={[2, 4]}>
            <Image style={styles.profileImage} source={{ uri: newProfileImage }} />
          </Shadow>
          <TouchableOpacity style={styles.editAvatar} activeOpacity={0.9} onPress={openProfileModal}>
            <Icon name="edit" size={20} color="#FFF4E0"></Icon>
          </TouchableOpacity>
          </>
        ) : (
          <Shadow distance={2} startColor="#211B17" offset={[2, 4]}>
            <Image style={styles.profileImage} source={{ uri: newProfileImage }} />
          </Shadow>
        ) }

        {type === 'edit' ? (
          <View style={styles.editContainer}>
            <View style={styles.inputGroup}>
              <Shadow distance={2} startColor="#211B17" offset={[2, 4]}>
                <TextInput
                  style={styles.input}
                  value={editedUsername}
                  onChangeText={setEditedUsername}
                  placeholder={username}
                  placeholderTextColor="#FFF4E080"
                />
              </Shadow>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfoContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.followsInfo} onPress={() => handleFollowersPress(userId)}>{followers} Followers</Text>
            <Text style={styles.followsInfo} onPress={() => handleFollowingPress(userId)}>{following} Following</Text>
          </View>
        )}

        <View style={styles.buttonsSection}>
          <View style={styles.iconRow}>
            <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={type === 'edit' ? handleSave : onEditProfile}
              >
                <Text style={styles.editButtonText}>
                  {type === 'edit' ? 'Save' : 'Edit Profile'}
                </Text>
              </TouchableOpacity>
            </Shadow>

            {type === 'profile' && (
              <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
                  <Icon name="setting" size={18} color="#FFF4E0" />
                </TouchableOpacity>
              </Shadow>
            )}
          </View>

          {type === 'profile' && (
            <View style={styles.qrCodeContainer}>
              <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
                <TouchableOpacity
                  style={[styles.iconButton, { width: 40, height: 40 }]}
                  onPress={onQRPress}
                >
                  <Icon name="qrcode" size={20} color="#FFF4E0" />
                </TouchableOpacity>
              </Shadow>
            </View>
          )}
        </View>

        <ProfileModal 
          isVisible={isProfileModalVisible}
          onClose={closeProfileModal}
          onTakePicture={handleTakePicture}
          onSelectFromGallery={pickAvatar}
          onRemoveAvatar={handleRemoveAvatar}
          avatar={profileImage}
        ></ProfileModal>
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
    editAvatar: {
      width: 36,
      height: 36,
      backgroundColor: '#6A4A36',
      borderRadius: 16,
      borderWidth: 2,
      borderColor: '#211B17',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      position: 'absolute',
      top: 8,
      left: 72,
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
    editContainer: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'center',
    },
    inputGroup: {
      marginBottom: 16,
    },
    input: {
      width: windowWidth / 2 - 20,
      height: 48,
      paddingHorizontal: 12,
      backgroundColor: '#403127',
      borderRadius: 8,
      color: '#FFF4E0',
      fontSize: 16,
      textAlignVertical: 'center',
      fontFamily: 'Arimo',
    },
    buttonsSection: {
      alignItems: 'flex-end',
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    qrCodeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconButton: {
      backgroundColor: '#6A4A36',
      borderRadius: 24,
      borderWidth: 2,
      borderColor: '#211B17',
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
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
