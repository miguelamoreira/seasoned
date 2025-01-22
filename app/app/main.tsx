import React from 'react';
import { Image, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter } from 'expo-router';
import LottieView from "lottie-react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.mainContainer}>

      <LottieView
        source={require("../assets/lotties/main.json")}
        style={styles.lottieBackground}
        autoPlay
        loop={false}
      />

      <View style={styles.titleContainer}>
        <Image source={require('../assets/images/frankie_1.png')} />
        <Text style={styles.appTitle}>Seasoned</Text>
      </View>

      <View style={styles.optionsContainer}>
        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
          <TouchableOpacity style={styles.signinButton} activeOpacity={0.9} onPress={() => router.push('/signin')}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        </Shadow>
        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
          <TouchableOpacity style={styles.signupButton} activeOpacity={0.9} onPress={() => router.push('/register')}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </Shadow>
      </View>

      <View style={styles.skipContainer}>
        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
          <TouchableOpacity style={styles.skipButton} activeOpacity={0.9} onPress={() => router.push('/homepage')}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        </Shadow>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF4E0',
    color: '#211B17',
  },
  lottieBackground: {
    position: 'absolute',
    width: '100%',
    height: '104%',
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    top: 164,
    zIndex: 999,
  },
  appTitle: {
    fontSize: 48,
    fontFamily: 'Caprasimo',
    textAlign: 'center',
  },
  optionsContainer: {
    alignItems: 'center',
    top: windowHeight / 3.5,
    gap: 24,
    zIndex: 1000,
  },
  signinButton: {
    backgroundColor: '#D8A84E',
    width: 220,
    paddingVertical: 6,
    borderRadius: 8,
    borderColor: '#211B17',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButton: {
    backgroundColor: '#ebce97',
    width: 220,
    paddingVertical: 6,
    borderRadius: 8,
    borderColor: '#211B17',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Arimo',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  skipContainer: {
    alignItems: 'center',
    top: windowHeight / 2,
    zIndex: 999,
  },
  skipButton: {
    backgroundColor: '#D8A84E',
    width: 80,
    paddingVertical: 6,
    borderRadius: 8,
    borderColor: '#211B17',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});