import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ProfileGenresProps = {
  genres: string[];
  type?: 'profile' | 'edit';
  onRemoveGenre?: (genre: string) => void;
};

export default function ProfileGenres({
  genres,
  type = 'profile',
  onRemoveGenre,
}: ProfileGenresProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenreSelection = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourite genres</Text>
      <View style={styles.genresContainer}>
        {genres.map((genre, index) => {
          const isSelected = selectedGenres.includes(genre);
          const isEditable = type === 'edit';

            const GenreTag = (
                <View style={[ styles.genreTag, isEditable && (isSelected ? styles.selectedTag : styles.unselectedTag),
                    !isEditable && { backgroundColor: index % 2 === 0 ? '#EE6363' : '#82AA59'},
                ]}
                >
                <TouchableOpacity style={styles.genreContent} onPress={isEditable ? () => toggleGenreSelection(genre) : undefined}>
                    <Text style={styles.genreText}>{genre}</Text>
                    {isEditable && isSelected && (
                    <Ionicons name="close" size={20}></Ionicons>
                    )}
                </TouchableOpacity>

                </View>
            );

            if (type === 'profile' || (isEditable && isSelected)) {
                return (
                <Shadow key={index} distance={2} startColor={'#211B17'} offset={[1, 2]} style={styles.shadowWrapper}>
                    {GenreTag}
                </Shadow>
                );
            }

            return <View key={index}>{GenreTag}</View>;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'DMSerifText',
    marginBottom: 8,
    lineHeight: 30,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shadowWrapper: {
    borderRadius: 20,
  },
  genreTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#211B17',
  },
  genreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedTag: {
    backgroundColor: '#D8A84E',
    borderColor: '#211B17',
    borderWidth: 2,
  },
  unselectedTag: {
    backgroundColor: 'transparent',
    borderColor: '#D8A84E',
  },
  genreText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: '#211B17',
  },
});