import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Shadow } from 'react-native-shadow-2';

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
};

type EpisodeType = 'default' | 'series';

type EpisodesProps = {
    episodes: Episode[];
    type: EpisodeType;
    seriesId: string;
    seasonNumber: string;
};

export default function EpisodesDisplay({ episodes, type, seriesId, seasonNumber }: EpisodesProps) {
    const router = useRouter();

    const [watchedEpisodes, setWatchedEpisodes] = useState<number[]>(
        episodes.filter((episode) => episode.watched).map((episode) => episode.id)
    );

    const handleEpisodeWatched = (episodeId: number) => {
        setWatchedEpisodes((prev) =>
            prev.includes(episodeId) ? prev.filter((id) => id !== episodeId) : [...prev, episodeId]
        );
    };

    const handleNavigateToEpisode = (episodeId: number) => {
        router.push(`/series/${seriesId}/seasons/${seasonNumber}/${episodeId}`);
    };

    const renderShow = ({ item }: { item: Episode }) => (
        <View style={styles.episodeContainer}>
            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <Image source={{ uri: item.image }} style={styles.episodeImage} />
            </Shadow>
            {type === 'default' ? (
                <View>
                    <View style={styles.episodeDetails}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.episodeTitle} numberOfLines={1}>{item.title}</Text>
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
                        <TouchableOpacity onPress={() => handleEpisodeWatched(item.id)}>
                            <AntDesign
                                name="eye"
                                size={32}
                                color={watchedEpisodes.includes(item.id) ? '#82AA59' : '#82AA5950'}
                            />
                        </TouchableOpacity>
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
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        paddingVertical: 8,
    },
    episodeImage: {
        width: 140,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#211B17',
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
        fontWeight: 'bold',
        marginBottom: 4,
        marginRight: 4,
        textOverflow: 'ellipsis',
    },
    episodeYear: {
        fontSize: 14,
        color: '#211B1770',
    },
    episodeSeason: {
        fontSize: 14,
        color: '#211B1770',
    },
    middleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showRating: {
        fontSize: 14,
        marginRight: 4,
    },
    episodeOptions: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginLeft: 16,
    },
});
