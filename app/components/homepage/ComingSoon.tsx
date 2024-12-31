import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { Shadow } from 'react-native-shadow-2';

type CardProps = {
    imageUri: string;
    title: string;
    subtitle?: string;
    date?: string;
};

type ComingContainerProps = {
    shows: CardProps[];
};

function Card({ imageUri, title, subtitle, date }: CardProps) {
    return (
        <Shadow distance={6} startColor={'#211B17'} offset={[2, 4]}>
            <View style={styles.card}>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <Image source={{ uri: imageUri }} style={styles.cardImage} />
                </Shadow>
                <View style={styles.cardContent}>
                    <Text style={styles.cardType}>Premiere</Text>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
                    {date && <Text style={styles.cardDate}>{date}</Text>}
                </View>
            </View>
        </Shadow>
    );
}

export default function ComingSoon({ shows }: ComingContainerProps) {
    return (
        <View style={styles.comingContainer}>
            <Text style={styles.heading}>Coming this week</Text>
            <Swiper style={styles.swiper} showsPagination={false} autoplay={false}>
                {shows.map((show, index) => (
                    <View key={index} style={styles.cardWrapper}>
                        <Card imageUri={show.imageUri} title={show.title} subtitle={show.subtitle} date={show.date} />
                    </View>
                ))}
            </Swiper>
        </View>
    );
}

const styles = StyleSheet.create({
    comingContainer: {
        marginTop: 20,
        flex: 1,
        width: 400,
        height: 230
    },
    heading: {
        fontSize: 24,
        fontFamily: 'DMSerifText',
        lineHeight: 45,
    },
    swiper: {
        height: 160,
        marginTop: 8,
    },
    cardWrapper: {
        marginHorizontal: 4,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C1855F',
        borderColor: '#211B17',
        borderWidth: 2,
        borderRadius: 8,
        padding: 16,
        width: 368,
    },
    cardImage: {
        width: 90,
        height: 130,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#211B17'
    },
    cardContent: {
        marginLeft: 10,
    },
    cardType: {
        fontSize: 14,
        color: '#FFF4E080',
        bottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        color: '#FFF4E0',
        fontFamily: 'DMSerifText',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#FFF4E080',
    },
    cardDate: {
        fontSize: 14,
        color: '#FFF4E0',
        top: 20,
    },
});
