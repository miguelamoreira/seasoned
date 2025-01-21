import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Progress from "react-native-progress";

import { getSeasonProgress } from "@/api/progressApi";
import OptionsTab from "@/components/OptionsTab";
import EpisodesDisplay from "@/components/episodes/EpisodesDisplay";
import { useUserContext } from "@/contexts/UserContext";
import { getViewingHistory } from "@/api/episodesApi";
import { useIsFocused } from "@react-navigation/native";

const calculateProgress = (
  data: any[],
  conditionFn: (episode: any) => boolean
): number => {
  const completed = data.filter(conditionFn).length;
  return data.length > 0 ? completed / data.length : 0;
};

type line = {
  season_id: number;
  user_id: number;
  progress_percentage?: number | null;
};
type EpisodesRAW = {
  episode_api_id: number;
  episode_progress: number | null;
  history_id: number;
  series_api_id: number;
  time_watched: number;
  user_id: number;
  watch_date: string;
};

export default function SeasonScreen() {
  const isFocused = useIsFocused();
  const { seriesId, seasonId } = useLocalSearchParams<{
    seriesId: string;
    seasonId: string;
  }>();
  const { user, token } = useUserContext();
  const router = useRouter();

  const [seasonProgress, setSeasonProgress] = useState(0);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seriesName, setSeriesName] = useState("");
  const [seasonNumber, setSeasonNumber] = useState(0);
  const [seasonProgressData, setseasonProgressData] = useState<any | null>(
    null
  );
  const [watchedEpisodesRaw, setWatchedEpisodesRaw] = useState<
    [EpisodesRAW] | []
  >([]);
  useEffect(() => {
    const fetchViewingHistory = async (userId?: number | null) => {
      if (userId) {
        try {
          let dataRaw = await getViewingHistory(userId);
          setWatchedEpisodesRaw(dataRaw);
        } catch (err) {
          console.error("Error fetching series progress: ", err);
        }
      }
    };
    fetchViewingHistory(user?.user_id);
  }, [user?.user_id, seasonId]);
  
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(
          `https://api.tvmaze.com/seasons/${seasonId}/episodes`
        );
        const data = await response.json();
        setEpisodes(
          data.map((episode: any) => ({
            id: episode.id,
            image: episode.image
              ? episode.image.medium
              : "https://via.placeholder.com/100",
            title: episode.name,
            year: new Date(episode.airdate).getFullYear(),
            season: episode.season,
            episode: episode.number,
            rating: episode.rating.average || null,
            watched: watchedEpisodesRaw.some(
              (line: EpisodesRAW) => line.episode_api_id === episode.id
            ),
            date: episode.airdate,
            runtime: episode.runtime,
          }))
        );
        const seasonDetailsResponse = await fetch(
         `https://api.tvmaze.com/seasons/${seasonId}`
        );
        const seasonDetailsData = await seasonDetailsResponse.json();
        setSeasonNumber(seasonDetailsData.number);

        const showResponse = await fetch(
          `https://api.tvmaze.com/shows/${seriesId}`
        );
        const showData = await showResponse.json();
        setSeriesName(showData.name);
        const fetchSeries = async (userId?: number | null) => {
            const data = await getSeasonProgress(userId);
            const filter = data.find((line: line) => line.season_id === parseInt(seasonId))

            if (filter != null) { 
             setSeasonProgress(filter.progress_percentage / 100);
            };
            
        }
        fetchSeries(user?.user_id)
        
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (watchedEpisodesRaw.length > 0) {
      fetchEpisodes();
    }
  }, [watchedEpisodesRaw, seasonId, isFocused, episodes]);
  
  

  return (
    <SafeAreaView style={styles.container}>
      <OptionsTab type="back" onBackPress={() => router.back()} />

      <View style={styles.contentContainer}>
        <Text style={styles.heading}>
          Season {seasonNumber} ({seriesName})
        </Text>
        <Progress.Bar
          progress={seasonProgress}
          width={null}
          height={8}
          color="#82AA59"
          borderColor="#352A23"
          unfilledColor="#352A23"
          style={styles.progressBar}
        />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#82AA59"
            style={styles.loader}
          />
        ) : (
          <EpisodesDisplay
            episodes={episodes}
            type="series"
            seriesId={seriesId}
            seasonNumber={seasonId}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF4E0",
    paddingVertical: 42,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 24,
    fontFamily: "DMSerifText",
    lineHeight: 45,
    color: "#211B17",
  },
  progressBar: {
    marginTop: 8,
  },
  loader: {
    marginTop: 16,
  },
});
