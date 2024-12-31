import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionsButton from '@/components/OptionsButton';

type ProfileOptionsProps = {
  title: string;
  options: { label: string; action: () => void }[];
  type: 'profile' | 'edit';
};

export default function ProfileOptions({ title, options, type }: ProfileOptionsProps) {
  return (
    <View style={[styles.container, type === 'edit' && { display: 'none' }]}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <OptionsButton key={index} option={option.label} onPress={option.action}/>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'DMSerifText',
    lineHeight: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
});
