import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function PageThree() {
  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/images/onboarding/arc_3.png')} style={[styles.arcImage, { height: 440 }]}/>
      <View style={styles.content}>
        <Image source={require('../../assets/images/onboarding/pan.png')}  style={styles.pan}/>
        <View style={styles.textContainer}>
            <Text style={styles.title}>Up next, main course</Text>
            <Text style={styles.description}>Cook up delicious reviews as hot as your friends can handle</Text>
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
    top: 40,
  },
  pan: {
    marginBottom: 40,
    alignSelf: 'center',
    width: 340,
    height: 220,
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
    paddingRight: 10,
  },
});
