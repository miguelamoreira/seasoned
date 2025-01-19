import React, { useState } from 'react';
import { Image, StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import PageOne from '@/components/onboarding/PageOne';
import PageTwo from '@/components/onboarding/PageTwo';
import PageThree from '@/components/onboarding/PageThree';
import PageFour from '@/components/onboarding/PageFour';

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (currentPage < 4) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pageColors = [ '#82AA59', '#D8A84E', '#EE6363', '#82AA59']

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {currentPage === 1 && <PageOne />}
        {currentPage === 2 && <PageTwo />}
        {currentPage === 3 && <PageThree />}
        {currentPage === 4 && <PageFour />}
      </View>

      <View style={styles.navigation}>
        {currentPage > 1 ? (
          <Shadow distance={1} startColor="#211B17" offset={[1, 2]}>
            <TouchableOpacity style={styles.arrowButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#211B17" />
            </TouchableOpacity>
          </Shadow>
        ) : (
          <Shadow distance={1} startColor="#211B17" offset={[1, 2]}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.push('/main')}
            >
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
          </Shadow>
        )}

        <View style={styles.dots}>
          {[1, 2, 3, 4].map((page) => (
            <View key={page} style={[ styles.dot, { backgroundColor: currentPage === page ? pageColors[page - 1] : '#352A23'}]}/>
          ))}
        </View>

        {currentPage < 4 ? (
          <Shadow distance={1} startColor="#211B17" offset={[1, 2]}>
            <TouchableOpacity style={styles.arrowButton} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={24} color="#211B17" />
            </TouchableOpacity>
          </Shadow>
        ) : (
          <Shadow distance={1} startColor="#211B17" offset={[2, 4]}>
            <TouchableOpacity style={styles.arrowButton} onPress={() => router.push('/main')}>
              <Ionicons name="arrow-forward" size={24} color="#211B17" />
            </TouchableOpacity>
          </Shadow>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5E0CE',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  skipButton: {
    backgroundColor: '#D8A84E',
    width: 80,
    paddingVertical: 4,
    borderRadius: 8,
    borderColor: '#211B17',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -40,
  },
  arrowButton: {
    backgroundColor: '#D8A84E',
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#211B17',
  },
  buttonText: {
    fontFamily: 'Arimo',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#211B17',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});