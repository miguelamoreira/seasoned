import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;

type SearchBarProps = {
    onFocus: () => void;
    onBlur: () => void;
    onChange: (text: string) => void;
    value: string; 
};

export default function SearchBar({ onFocus, onBlur, onChange, value }: SearchBarProps) {
    return (
        <View style={styles.searchBarContainer}>
            <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#FFF4E0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        placeholderTextColor="#FFF4E080"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                </View>
            </Shadow>
        </View>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        zIndex: 10,
        backgroundColor: '#FFF4E0',
        paddingBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#403127',
        paddingVertical: 10,
        borderRadius: 8,
        height: 48,
        width: windowWidth - 32,
    },
    searchIcon: {
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        color: '#FFF4E0',
        fontSize: 16,
        height: 48,
        textAlignVertical: 'center',
    },
});