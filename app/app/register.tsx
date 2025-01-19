import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

import OptionsTab from '@/components/OptionsTab';
import { fetchGenres } from '@/api/genresApi'
import { createUser } from '@/api/authApi';

const windowWidth = Dimensions.get('window').width;

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
    const [loadingGenres, setLoadingGenres] = useState(false);
    const [genresError, setGenresError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (currentStep === 2) {
            const loadGenres = async () => {
                setLoadingGenres(true);
                setGenresError(null);

                try {
                    const genreData = await fetchGenres();
                    setGenres(genreData);
                } catch (error) {
                    setGenresError('Failed to load genres. Please try again later.');
                } finally {
                    setLoadingGenres(false);
                }
            };

            loadGenres();
        }
    }, [currentStep]);

    const handleBackButton = () => {
        if (currentStep === 1) {
            router.push('/main');
        } else {
            setCurrentStep(1);
        }
    };

    const toggleGenre = (genreId: number) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.includes(genreId)
                ? prevGenres.filter((id) => id !== genreId)
                : [...prevGenres, genreId]
        );
    };

    const handleSubmit = async () => {
        const payload = { name: username, email, password, confirmPassword, preferredGenres: selectedGenres, };
    
        try {
            const data = await createUser(payload);
            console.log('Response from server:', data);
            router.push('/signin'); 
        } catch (error) {
            console.error('Registration error:', error);
        }
    };
    

    const renderFirstPart = () => (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Enter your username" placeholderTextColor="#FFF4E080"/>
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor="#FFF4E080" keyboardType="email-address"/>
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor="#FFF4E080" secureTextEntry={true}/>
                </Shadow>
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm your password</Text>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Enter your password again" placeholderTextColor="#FFF4E080" secureTextEntry={true}/>
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
            {loadingGenres ? (
                <Text>Loading genres...</Text>
            ) : genresError ? (
                <Text style={styles.errorText}>{genresError}</Text>
            ) : (
                <View style={styles.genresContainer}>
                    {genres.map((genre) => {
                        const isSelected = selectedGenres.includes(genre.id);
                        return (
                            <TouchableOpacity
                                key={genre.id}
                                style={[
                                    styles.genreButton,
                                    isSelected && styles.genreButtonSelected,
                                    { borderColor: isSelected ? '#211B17' : '#D8A84E' },
                                ]}
                                onPress={() => toggleGenre(genre.id)}
                            >
                                <Text style={styles.genreText}>{genre.name}</Text>
                                {isSelected && (
                                    <Icon name="close" size={24} color="#211B17" style={styles.removeIcon} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
            <View style={styles.optionsContainer}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <TouchableOpacity style={styles.signupButton} activeOpacity={0.9} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                </Shadow>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <OptionsTab type='register' onStepBackPress={handleBackButton}></OptionsTab>

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
        paddingVertical: 42,
        color: '#211B17'
    },
    headingContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    heading: {
        fontFamily: 'DMSerifText',
        fontSize: 40,
        textAlign: 'center',
        lineHeight: 45,
    },
    formContainer: {
        marginTop: 40,
        paddingHorizontal: 16,
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
        width: windowWidth - 32,
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
        marginTop: 20,
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
    removeIcon: {
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});
