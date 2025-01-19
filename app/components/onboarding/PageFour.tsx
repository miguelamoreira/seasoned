import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function PageFour() {
  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/images/onboarding/arc_4.png')} style={[styles.arcImage, { height: 540 }]}/>
      <View style={styles.content}>
        <Image source={require('../../assets/images/onboarding/badges.png')}  style={styles.badges}/>
        <View style={styles.textContainer}>
          <Text style={styles.title}>For dessert,</Text>
          <Text style={styles.description}>Treat yourself to some badges and show off your expertise in the kitchen</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    top: -40,
  },
  badges: {
    marginBottom: 100,
    alignSelf: 'center',
    width: 360,
    height: 370,
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
