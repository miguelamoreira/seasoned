import React, { useState } from 'react';
import { Image, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter } from 'expo-router';

import OptionsTab from '@/components/OptionsTab';

export default function RegisterScreen() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const router = useRouter();

    const handleBackButton = () => {
        if (currentStep === 1) {
            router.push('/');
        } else {
            setCurrentStep(1);
        }
    };

    const toggleGenre = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const renderFirstPart = () => (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} placeholder="Enter your username" placeholderTextColor="#FFF4E080"/>
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#FFF4E080" keyboardType="email-address"/>
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#FFF4E080" secureTextEntry={true}/>
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm your password</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} placeholder="Enter your password again" placeholderTextColor="#FFF4E080" secureTextEntry={true}/>
                </Shadow>
            </View>
            <View style={styles.nextContainer}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TouchableOpacity style={styles.nextButton} activeOpacity={0.9} onPress={() => setCurrentStep(2)}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </Shadow>
                <Text style={styles.footerText}>
                    Do you already have an account?{' '}<Text style={styles.boldText} onPress={() => router.push('/signin')}>Sign in</Text>
                </Text>
            </View>
        </View>
    );

    const renderSecondPart = () => (
        <View style={styles.formContainer}>
            <Text style={styles.genresTitle}>Favourite genres</Text>
            <View style={styles.genresContainer}>
                {['Action','Adventure','Animation','Comedy','Crime','Drama','Fantasy','Musical','Romance','Science Fiction','Thriller',]
                .map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    const buttonStyle = [
                        styles.genreButton,
                        isSelected && styles.genreButtonSelected,
                        { borderColor: isSelected ? '#211B17' : '#D8A84E' },
                    ];

                    const buttonContent = (
                        <TouchableOpacity key={genre} style={buttonStyle} onPress={() => toggleGenre(genre)}>
                            <Text style={[styles.genreText, isSelected && styles.genreTextSelected]}>{genre}</Text>
                            {isSelected && <Text style={styles.removeText}>X</Text>}
                        </TouchableOpacity>
                    );

                    return isSelected ? (
                        <Shadow key={genre} distance={2} startColor={'#211B17'} offset={[1, 2]}>
                            {buttonContent}
                        </Shadow>
                    ) : (
                        buttonContent
                    );
                })}
            </View>
            <View style={styles.optionsContainer}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TouchableOpacity style={styles.signupButton} activeOpacity={0.9}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                </Shadow>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type='back' onBackPress={() => router.back()}></OptionsTab>

            <View style={styles.headingContainer}>
                <Text style={styles.heading}>{currentStep === 1 ? 'Sign up' : 'Select Genres'}</Text>
            </View>

            {currentStep === 1 ? renderFirstPart() : renderSecondPart()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF4E0',
        paddingHorizontal: 16,
        paddingVertical: 42,
        color: '#211B17'
    },
    headingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    heading: {
        fontFamily: 'DMSerifText',
        fontSize: 40,
        textAlign: 'center',
        lineHeight: 45,
    },
    formContainer: {
        marginTop: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontFamily: 'Arimo',
        marginBottom: 8,
    },
    input: {
        height: 48,
        width: 378,
        paddingHorizontal: 12,
        backgroundColor: '#403127',
        borderRadius: 8,
        color: '#FFF4E0',
        fontSize: 16,
    },
    nextContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    optionsContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    nextButton: {
        backgroundColor: '#D8A84E',
        width: 220,
        paddingVertical: 10,
        borderRadius: 8,
        borderColor: '#211B17',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupButton: {
        backgroundColor: '#D8A84E',
        width: 220,
        paddingVertical: 10,
        borderRadius: 8,
        borderColor: '#211B17',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Arimo',
        fontSize: 18,
        fontWeight: '700',
    },
    footerText: {
        fontSize: 16,
        fontFamily: 'Arimo',
        color: '#211B17',
        marginTop: 10,
    },
    boldText: {
        fontWeight: '700',
    },
    genresTitle: {
        fontWeight: '700',
        fontSize: 20,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        marginTop: 20,
    },
    genreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF4E0',
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    genreButtonSelected: {
        backgroundColor: '#D8A84E',
    },
    genreText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#211B17',
        fontFamily: 'Arimo',
    },
    genreTextSelected: {
        color: '#FFF4E0',
    },
    removeText: {
        fontSize: 16,
        color: '#FFF4E0',
        marginLeft: 10,
        fontWeight: '700',
    },
});
