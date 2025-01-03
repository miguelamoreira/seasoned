import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { addPreferredGenre, deletePreferredGenre } from '@/api/genresApi'; 

type ProfileGenresProps = {
  genres: { genre_id: number; genre_name: string; selected: boolean }[]; 
  userId: number; 
  type?: 'profile' | 'edit';
  onGenresChange: (updatedGenres: { genre_id: number; genre_name: string; selected: boolean }[]) => void;
};

export default function ProfileGenres({ genres, userId, type = 'profile', onGenresChange }: ProfileGenresProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    type === 'edit' ? genres.filter((genre) => genre.selected).map((genre) => genre.genre_name) : []
  );

  useEffect(() => {
    if (type === 'edit') {
      setSelectedGenres(genres.filter((genre) => genre.selected).map((genre) => genre.genre_name));
    } else {
      setSelectedGenres([]);
    }
  }, [type, genres]);

  const toggleGenreSelection = async (genre: string, genreId: number) => {
    try {
      let updatedGenres = [...genres];

      if (selectedGenres.includes(genre)) {
        updatedGenres = updatedGenres.map((item) =>
          item.genre_name === genre ? { ...item, selected: false } : item
        );
        setSelectedGenres(selectedGenres.filter((item) => item !== genre));
        await deletePreferredGenre(userId, genreId);
      } else {
        updatedGenres = updatedGenres.map((item) =>
          item.genre_name === genre ? { ...item, selected: true } : item
        );
        setSelectedGenres([...selectedGenres, genre]);
        await addPreferredGenre(userId, genreId);
      }

      onGenresChange(updatedGenres);
    } catch (error) {
      console.error('Error toggling genre selection:', error);
    }
  };

  const genresToDisplay = type === 'profile' ? genres.filter((genre) => genre.selected) : genres;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourite genres</Text>
      <View style={styles.genresContainer}>
        {genresToDisplay.map((genreItem, index) => {
          const { genre_name, selected, genre_id } = genreItem;
          const isSelected = type === 'edit' ? selectedGenres.includes(genre_name) : selected; 
          const isEditable = type === 'edit';

          const GenreTag = (
            <View
              style={[
                styles.genreTag,
                isEditable && (isSelected ? styles.selectedTag : styles.unselectedTag),
                !isEditable && { backgroundColor: index % 2 === 0 ? '#EE6363' : '#82AA59' },
              ]}
            >
              <TouchableOpacity
                style={styles.genreContent}
                onPress={isEditable ? () => toggleGenreSelection(genre_name, genre_id) : undefined}
              >
                <Text style={styles.genreText}>{genre_name}</Text>
                {isEditable && isSelected && <Ionicons name="close" size={20} />}
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
    paddingHorizontal: 16,
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
    backgroundColor: '#FFF4E0',
    borderColor: '#D8A84E',
  },
  genreText: {
    fontSize: 16,
    fontFamily: 'Arimo',
    fontWeight: '700',
    color: '#211B17',
  },
});