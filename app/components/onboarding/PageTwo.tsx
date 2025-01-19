import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function PageTwo() {
  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/images/onboarding/arc_2.png')} style={[styles.arcImage, { height: 440 }]}/>
      <View style={styles.playContainer}>
        <Image source={require('../../assets/images/onboarding/play.png')}></Image>
        <Image source={require('../../assets/images/onboarding/play.png')}></Image>
        <Image source={require('../../assets/images/onboarding/play.png')}></Image>
      </View>
      <View style={styles.content}>
        <Image source={require('../../assets/images/onboarding/frankie_chief.png')}  style={styles.frankie}/>
        <View style={styles.textContainer}>
            <Text style={styles.title}>For starters,</Text>
            <Text style={styles.description}>Keep track of your shows and stay up to date on new releases, all in one place</Text>
        </View>
      </View>
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
  playContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    top: -48,
  },
  frankie: {
    marginBottom: 40,
    marginLeft: 40,
    alignSelf: 'center',
    width: 320,
    height: 280,
  },
  textContainer: {
    paddingHorizontal: 40,
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
  },
});
