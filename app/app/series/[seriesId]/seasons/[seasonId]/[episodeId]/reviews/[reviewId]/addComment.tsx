import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

import OptionsTab from '@/components/OptionsTab';
import { useUserContext } from '@/contexts/UserContext';
import { addCommentToReview } from '@/api/reviewCommentsApi';

export default function SeriesReviewAddCommentScreen() {
  const { user } = useUserContext();
  const router = useRouter();
  const { seriesId, seasonId, episodeId, reviewId } = useLocalSearchParams<{ seriesId: string; seasonId: string; episodeId: string, reviewId: string }>();

  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleAddComment = async () => {
    if (!comment.trim()) {
      setMessage('Comment cannot be empty.');
      return;
    }

    try {
      await addCommentToReview(reviewId, user?.user_id, comment);
      setComment('');
      router.push(`/series/${seriesId}/reviews/${reviewId}`)
    } catch (error) {
      setMessage('Failed to add the comment. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <OptionsTab
        type="cross-check"
        onCrossPress={() => router.back()}
        onCheckPress={handleAddComment}
      >
      </OptionsTab>
      <Text style={styles.heading}>New comment</Text>

      <View style={styles.inputGroup}>
        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#FFF4E080"
            value={comment}
            onChangeText={setComment}
            multiline
          />
        </Shadow>
      </View>

      {message ? (
        <Text style={styles.message}>
          {message}
        </Text>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF4E0',
    paddingTop: 42,
    color: '#211B17',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'DMSerifText',
    lineHeight: 45,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  inputGroup: {
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    width: 378,
    height: 112,
    paddingHorizontal: 12,
    backgroundColor: '#403127',
    borderRadius: 8,
    color: '#FFF4E0',
    fontSize: 16,
    fontFamily: 'Arimo',
    textAlignVertical: 'top',
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
    color: '#EE6363',
  }
});