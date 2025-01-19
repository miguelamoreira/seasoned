import React from 'react';
import { Image, StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.mainContainer}>

      <Image source={require('../assets/images/rainbow_1.png')} style={styles.rainbowTop}/>
      <Image source={require('../assets/images/rainbow_2.png')} style={styles.rainbowBottom}/>

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
    paddingHorizontal: 16,
    color: '#211B17'
  },
  rainbowTop: {
    position: 'absolute',
    top: -40,
    left: 104,
    width: '100%',
    height: 400, 
    resizeMode: 'contain',
  },
  rainbowBottom: {
    position: 'absolute',
    bottom: -64,
    width: '100%',
    height: 400, 
    resizeMode: 'contain',
  },
  titleContainer: {
    alignItems: 'center',
    top: 120,
  },
  appTitle: {
    fontSize: 48,
    fontFamily: 'Caprasimo',
    textAlign: 'center',
  },
  optionsContainer: {
    alignItems: 'center',
    top: 188,
    gap: 24,
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
    top: 440,
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
