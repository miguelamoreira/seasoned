import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface RatingReviewContainerProps {
    title?: string;
    rating: number;
    review: string;
    onRatingChange: (rating: number) => void;
    onReviewChange: (text: string) => void;
    liked: boolean; // The liked state now comes from the parent component
    onLikeToggle: () => void; // The callback for toggling the heart icon
}

export default function RatingReviewContainer({
    title,
    rating,
    review,
    onRatingChange,
    onReviewChange,
    liked,
    onLikeToggle,
}: RatingReviewContainerProps) {

    const handleRatingPress = (index: number) => {
        onRatingChange(index + 1);
    };

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}

            <View style={styles.ratingRow}>
                <View style={styles.ratingContainer}>
                    <Text style={styles.label}>Rating</Text>
                    <View style={styles.starsContainer}>
                        {Array.from({ length: 5 }, (_, index) => (
                            <TouchableOpacity key={index} onPress={() => handleRatingPress(index)}>
                                <AntDesign
                                    name="star"
                                    size={28}
                                    color={index < rating ? '#D8A84E' : '#D8A84E70'}
                                    style={{ marginHorizontal: 2 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <TouchableOpacity onPress={onLikeToggle} style={styles.heartContainer}>
                    <AntDesign
                        name={liked ? 'heart' : 'heart'}
                        size={40}
                        color={liked ? '#EE6363' : '#EE636370'}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Review</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Write a review..."
                    placeholderTextColor="#FFF4E080"
                    value={review}
                    onChangeText={onReviewChange}
                    multiline
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
    },
    title: {
        fontSize: 18,
        fontFamily: 'DMSerifText',
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Arimo',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    ratingContainer: {
        flex: 1,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heartContainer: {
        marginLeft: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputGroup: {
        width: '100%',
    },
    input: {
        width: '100%',
        height: 112,
        paddingHorizontal: 12,
        backgroundColor: '#403127',
        borderRadius: 8,
        color: '#FFF4E0',
        fontSize: 16,
        fontFamily: 'Arimo',
        textAlignVertical: 'top',
    },
});