import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Shadow } from "react-native-shadow-2";
import { useUserContext } from "@/contexts/UserContext";
import { updateUserTimeWatched, findUserById } from "@/api/userApi";
import { findSeriesById } from "@/api/seriesApi";
import {
  postViewingHistory,
  getViewingHistory,
  deleteViewingHistory,
} from "@/api/episodesApi";
import { postSeriesProgress, postSeasonProgress } from "@/api/progressApi";

type Episode = {
  id: number;
  image: string;
  title: string;
  year: number;
  season: number;
  episode: number;
  rating?: number;
  date?: string;
  watched?: boolean;
  runtime?: number;
};

type EpisodeType = "default" | "series";

type EpisodesProps = {
  episodes: Episode[];
  type: EpisodeType;
  seriesId: string;
  seasonNumber: string;
};

type apiBody = {
  series_api_id: number;
  episode_api_id: number;
  time_watched: number | undefined;
  season_api_id: number;
};

type seasonProgressBody = {
  season_id: number;
  progress_percentage: number;
};

type seriesProgressBody = {
  series_id: number;
  progress_percentage: number;
};

export default function EpisodesDisplay({
  episodes,
  type,
  seriesId,
  seasonNumber,
}: EpisodesProps) {
  const { user, token } = useUserContext();
  const router = useRouter();
  const [watchedEpisodes, setWatchedEpisodes] = useState<number[]>(
    episodes.filter((episode) => episode.watched).map((episode) => episode.id)
  );

  const updateUser = async (time_watched: number) => {
    const result = await updateUserTimeWatched(user?.user_id, time_watched);
  };

  const getUserTimewatched = async () => {
    try {
        const data = await findUserById(user?.user_id);
        
        if (data?.time_watched != undefined) {
            console.log(data.time_watched);
            return data.time_watched
          
          
        } else {
          console.error("time_watched is not defined in the response data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
  };

  const updateProgress = async () => {
    const viewingHistory = await getViewingHistory(user?.user_id);
    let seriesData = await findSeriesById(seriesId);
    const totalEpisodeOrder = seriesData.seasons.reduce(
      (sum: any, episode: any) => sum + episode.episodeOrder,
      0
    );
    const seriesDataHistory = viewingHistory.filter(
      (item: any) => item.series_api_id === parseInt(seriesId)
    );
    console.log(seriesDataHistory);

    const progressSeries = Math.round(
      (seriesDataHistory.length * 100) / totalEpisodeOrder
    );

    const seasonData = seriesDataHistory.filter(
      (season: any) => season.season_api_id === parseInt(seasonNumber)
    );


    const progressSeason = Math.round(
      (seasonData.length * 100) /
        seriesData.seasons.find(
          (season: any) => season.id === parseInt(seasonNumber)
        ).episodeOrder
    );
    console.log(progressSeries);
    console.log(progressSeason);
    let seasonProgressBody: seasonProgressBody = {
      season_id: parseInt(seasonNumber),
      progress_percentage: progressSeason,
    };
    await postSeasonProgress(user?.user_id, seasonProgressBody);

    let seriesProgressBody: seriesProgressBody = {
      series_id: parseInt(seriesId),
      progress_percentage: progressSeries,
    };
    await postSeriesProgress(user?.user_id, seriesProgressBody);
  };

  const handleEpisodeWatched = async (episodeId: number) => {
    const episode: Episode | undefined = episodes.find(
      (line) => line.id === episodeId
    );
    if (watchedEpisodes.includes(episodeId)) {
      const viewingHistory = await getViewingHistory(user?.user_id);
      const seriesDataHistory = viewingHistory.find(
        (item: any) => item.episode_api_id === parseInt(episode?.id)
      );
      await deleteViewingHistory(seriesDataHistory.history_id);
      const time_watched = await getUserTimewatched()

      let currentTimeWatched =
        parseInt(time_watched) - parseInt(episode?.runtime);
        
    console.log(currentTimeWatched);
      await updateUser(currentTimeWatched);

      await updateProgress();
    } else {
      let apibody: apiBody = {
        series_api_id: parseInt(seriesId),
        episode_api_id: episodeId,
        time_watched: episode?.runtime,
        season_api_id: parseInt(seasonNumber),
      };

      await postViewingHistory(user?.user_id, apibody); 

      const time_watched = await getUserTimewatched()
      console.log(time_watched);
      

      let currentTimeWatched =
        parseInt(time_watched) + parseInt(episode?.runtime);
    console.log(currentTimeWatched);
    

      await updateUser(currentTimeWatched);
      await updateProgress();
    }
    setWatchedEpisodes((prev) =>
      prev.includes(episodeId)
        ? prev.filter((id) => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const handleNavigateToEpisode = (episodeId: number) => {
    router.push(`/series/${seriesId}/seasons/${seasonNumber}/${episodeId}`);
  };

  const renderShow = ({ item }: { item: Episode }) => (
    <View style={styles.episodeContainer}>
      <Shadow distance={2} startColor={"#211B17"} offset={[2, 4]}>
        <Image source={{ uri: item.image }} style={styles.episodeImage} />
      </Shadow>
      {type === "default" ? (
        <View>
          <View style={styles.episodeDetails}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.episodeTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.episodeYear}>{item.year}</Text>
            </View>
            <Text style={styles.episodeSeason}>
              Season {item.season} Episode {item.episode}
            </Text>
          </View>
          <View style={styles.episodeDate}>
            <Text>{item.date}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.middleRow}>
          <View style={styles.episodeDetails}>
            <Text style={styles.episodeTitle}>Episode {item.episode}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.showRating}>{item.rating}</Text>
              <AntDesign name="star" size={20} color="#D8A84E" />
            </View>
          </View>
          <View style={styles.episodeOptions}>
            {token && (
              <TouchableOpacity onPress={() => handleEpisodeWatched(item.id)}>
                <AntDesign
                  name="eye"
                  size={32}
                  color={
                    watchedEpisodes.includes(item.id) ? "#82AA59" : "#82AA5950"
                  }
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleNavigateToEpisode(item.id)}>
              <FontAwesome name="chevron-right" size={24} color="#211B17" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={episodes}
      keyExtractor={(item) => `${item.id}`}
      renderItem={renderShow}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 16,
  },
  episodeContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 8,
  },
  episodeImage: {
    width: 140,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#211B17",
  },
  episodeDetails: {
    flex: 1,
    marginLeft: 16,
  },
  episodeDate: {
    marginLeft: 16,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    marginRight: 4,
    textOverflow: "ellipsis",
  },
  episodeYear: {
    fontSize: 14,
    color: "#211B1770",
  },
  episodeSeason: {
    fontSize: 14,
    color: "#211B1770",
  },
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  showRating: {
    fontSize: 14,
    marginRight: 4,
  },
  episodeOptions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginLeft: 16,
  },
});
