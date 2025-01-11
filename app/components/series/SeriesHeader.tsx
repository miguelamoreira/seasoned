import React from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

export default function SeriesHeader({ image }: { image: string }) {
    return (
        <ImageBackground 
            source={require('../../assets/images/pattern.png')} 
            style={styles.headerContainer}
        >
            <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/star.png')} style={styles.star}></Image>
                <Shadow distance={2} startColor={'#211B17'} offset={[2, 4]}>
                    <Image source={{ uri: image }} style={styles.seriesImage} />
                </Shadow>
            </View>
            <View style={styles.ellipse}>
                <Image source={require('../../assets/images/ellipse.png')} />
            </View>
        </ImageBackground>
        
    );
}

const styles = StyleSheet.create({
    headerContainer: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 16,
        marginLeft: -16,
        marginRight: -16,
    },
    imageContainer: {
        zIndex: 1,
    },
    ellipse: { 
        position: 'absolute', 
        bottom: -4 
    },
    star: {
        position: 'absolute',
        zIndex: 1,
        right: -16,
        top: -4,
    },
    seriesImage: { 
        width: 150, 
        height: 190, 
        borderRadius: 8, 
        marginBottom: 16, 
        borderWidth: 4, 
        borderColor: '#211B17' 
    },
});
