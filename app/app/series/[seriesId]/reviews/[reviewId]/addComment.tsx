import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

import OptionsTab from '@/components/OptionsTab';

export default function SeriesReviewAddCommentScreen() {
  const router = useRouter();
  const { seriesId, reviewId } = useLocalSearchParams<{ seriesId: string, reviewId: string }>();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <OptionsTab type="cross-check" 
        onCrossPress={() => router.back()}
        onCheckPress={() => router.back()}
      >
      </OptionsTab>
      <Text style={styles.heading}>New comment</Text>

      <View style={styles.inputGroup}>
        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
          <TextInput style={styles.input} placeholder="Write a comment..." placeholderTextColor="#FFF4E080"/>
        </Shadow>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF4E0',
    paddingTop: 42,
    color: '#211B17'
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
});