import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from "lottie-react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PageOne() {
  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/images/onboarding/arc_1.png')} style={[styles.arcImage, { height: 440 }]}/>
      <LottieView
        source={require("../../assets/lotties/onboardingOne.json")}
        style={{width: "100%", height: "110%"}}
        autoPlay
        loop={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5E0CE',
    width: windowWidth
  },
  arcImage: {
    resizeMode: 'cover',
    position: 'absolute',
    top: -20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    position: 'relative',
    top: 40,
  },
  frankie: {
    marginBottom: 40,
    alignSelf: 'center',
    width: 300,
    height: 280,
  },
  title: {
    fontSize: 34,
    fontFamily: 'DMSerifText',
    color: '#211B17',
    textAlign: 'left',
    marginBottom: 24,
  },
  description: {
    fontSize: 20,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: '#211B17',
    textAlign: 'left',
    paddingRight: 10,
  },
});