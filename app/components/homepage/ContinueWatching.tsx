import React, { useState } from "react";
import { StyleSheet, Text, View, Animated, PanResponder, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Shadow } from 'react-native-shadow-2';

type EpisodeDetails = {
  title: string;
  seasonEpisode: string;
  duration: string;
  seriesTitle: string;
  imageUri: string;
};

type ContinueWatchingProps = {
  episode: EpisodeDetails;
  onUnfollow: () => void;
  onLog: () => void;
};

export default function ContinueWatching({ episode, onUnfollow, onLog }: ContinueWatchingProps) {
  const [translateX] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
    onPanResponderMove: (_, gestureState) => { translateX.setValue(gestureState.dx); },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 80) {
        Animated.spring(translateX, { toValue: 108, useNativeDriver: true }).start(() => { onLog(); resetPosition(); });
      } else if (gestureState.dx < -80) {
        Animated.spring(translateX, { toValue: -108, useNativeDriver: true }).start(() => { onUnfollow(); resetPosition(); });
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Continue watching...</Text>

      <View style={styles.actionContainer}>
        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
          <View style={[styles.actionButton, styles.unfollowButton]}>
            <Icon name="bookmark" size={24} color="#fff4e0" />
            <Text style={styles.actionText}>Unfollow</Text>
          </View>
        </Shadow>

        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
          <View style={[styles.actionButton, styles.logButton]}>
            <Icon name="create" size={24} color="#fff4e0" />
            <Text style={styles.actionText}>Log</Text>
          </View>
        </Shadow>
      </View>

      <Animated.View {...panResponder.panHandlers} style={[ { transform: [{ translateX }] } ]}>
        <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
        <View style={ styles.episodeContainer }>
          <Shadow distance={2} startColor={'#211B17'} offset={[10, 4]}>
            <Image style={styles.episodeImage} resizeMode="cover" source={{ uri: episode.imageUri }}/>
          </Shadow>
          <View style={styles.episodeDetails}>
            <Text style={styles.episodeTitle}>{episode.title}</Text>
            <View style={styles.episodeMetaContainer}>
              <Text style={styles.episodeMeta}>{episode.seasonEpisode}</Text>
              <Text style={styles.episodeDuration}>{episode.duration}</Text>
            </View>
            <Text style={styles.seriesTitle}>{episode.seriesTitle}</Text>
          </View>
        </View>
        </Shadow>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 196,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    overflow: "hidden",
  },
  heading: {
    fontSize: 24,
    fontFamily: 'DMSerifText',
    lineHeight: 45,
    alignSelf: 'flex-start',
  },
  actionContainer: {
    position: "absolute",
    bottom: 4,
    flexDirection: "row",
    width: "100%",
    height: 124,
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#211B17',
    width: 98, 
    height: 115,
  },
  unfollowButton: {
    backgroundColor: "#ee6363",
  },
  logButton: {
    backgroundColor: "#82aa59",
  },
  actionText: {
    fontSize: 16, 
    fontFamily: "Arimo",
    fontWeight: "700",
    color: "#fff4e0",
    textAlign: "center",
    marginTop: 4, 
  },
  episodeContainer: {
    flexDirection: "row",
    backgroundColor: "#6a4a36",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#181412",
    height: 120,
    padding: 8, 
    width: 378,
  },
  episodeImage: {
    width: 140,
    height: "100%",
    borderRadius: 4,
    marginLeft: 8,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#211B17'
  },
  episodeDetails: {
    flex: 1,
    paddingLeft: 12,
  },
  episodeTitle: {
    fontSize: 20, 
    fontFamily: "DMSerifText",
    color: "#fff4E0",
  },
  episodeMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  episodeMeta: {
    fontSize: 16,
    fontFamily: "Arimo",
    fontWeight: 700,
    color: "#fff4E0",
  },
  episodeDuration: {
    fontSize: 16,
    fontFamily: "Arimo-Bold",
    color: "#fff4E050",
  },
  seriesTitle: {
    fontSize: 16,
    fontFamily: "Arimo-Bold",
    color: "#fff4e0",
  },
});
