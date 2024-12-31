import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/AntDesign';
import { useRouter } from 'expo-router';

import ProfileModal from './ProfileModal';

type ProfileHeaderProps = {
    type: 'profile' | 'edit';
    username: string;
    followers: number;
    following: number;
    profileImage: string;
    onEditProfile: () => void;
    onSaveProfile: (newUsername: string) => void;
    onSettingsPress: () => void;
    onQRPress: () => void;
};

export default function ProfileHeader({ type, username, followers, following, profileImage, onEditProfile, onSaveProfile, onSettingsPress, onQRPress }: ProfileHeaderProps) {
    const [editedUsername, setEditedUsername] = useState(username);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false); 
    const router = useRouter();

    const handleSave = () => {
      onSaveProfile(editedUsername);
    };

    const openProfileModal = () => {
      setIsProfileModalVisible(true);
    };

    const closeProfileModal = () => {
      setIsProfileModalVisible(false);
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
            <Image style={styles.profileImage} source={{ uri: profileImage }} />
          </Shadow>
          <TouchableOpacity style={styles.editAvatar} activeOpacity={0.9} onPress={openProfileModal}>
            <Icon name="edit" size={20} color="#FFF4E0"></Icon>
          </TouchableOpacity>
          </>
        ) : (
          <Shadow distance={2} startColor="#211B17" offset={[2, 4]}>
            <Image style={styles.profileImage} source={{ uri: profileImage }} />
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
                  placeholder="Enter new username"
                  placeholderTextColor="#FFF4E080"
                />
              </Shadow>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfoContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.followsInfo} onPress={handleFollowersPress}>{followers} Followers</Text>
            <Text style={styles.followsInfo} onPress={handleFollowingPress}>{following} Following</Text>
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
          onTakePicture={() => console.log('Take picture pressed')}
          onSelectFromGallery={() => console.log('Select from gallery pressed')}
          onRemoveAvatar={() => console.log('Remove avatar pressed')}
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
      width: 200,
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