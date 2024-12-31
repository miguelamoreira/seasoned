import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

type ProfileModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onTakePicture: () => void;
    onSelectFromGallery: () => void;
    onRemoveAvatar: () => void;
};

export default function ProfileModal({ isVisible, onClose, onTakePicture, onSelectFromGallery, onRemoveAvatar }: ProfileModalProps) {
    return (
        <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                <AntDesign name="up" size={24} color="#FFF4E0" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.optionRow} onPress={onTakePicture}>
                <AntDesign name="camera" size={24} color="#82AA59" />
                <Text style={styles.optionText}>Take a picture</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={onSelectFromGallery}>
                <MaterialIcons name="photo-library" size={24} color="#82AA59" />
                <Text style={styles.optionText}>Select from gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={onRemoveAvatar}>
                <MaterialIcons name="delete" size={24} color="#EE6363" />
                <Text style={styles.optionText}>Remove avatar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: '#211B1750',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#403127',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingVertical: 8,
    },
    optionText: {
        marginLeft: 12,
        color: '#FFF4E0',
        fontSize: 20,
    },
});
