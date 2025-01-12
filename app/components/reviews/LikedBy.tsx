import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

type LikedUser = {
  name: string;
  avatar: string;
};

type LikedByProps = {
  likedUsers: LikedUser[];
};

export default function LikedBy({ likedUsers }: LikedByProps) {
  return (
    <View>
      <Text style={styles.subHeading}>Liked by</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarScrollView}>
        {likedUsers.map((user, index) => (
          <View key={index} style={styles.avatarContainer}>
            <Shadow distance={1} startColor={'#211B17'} offset={[1, 2]}>
              <Image source={{ uri: user.avatar }} style={styles.avatar}></Image>
            </Shadow>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  subHeading: {
    fontSize: 20,
    fontFamily: 'DMSerifText',
    lineHeight: 35,
    marginTop: 24,
    marginBottom: 12,
  },
  avatarScrollView: {
    marginBottom: -8,
  },
  avatarContainer: {
    marginRight: 12,
    paddingBottom: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#211B17',
  },
});
