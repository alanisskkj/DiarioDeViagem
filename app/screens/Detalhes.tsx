import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, useTheme, useViagens } from "../types/navigations";

type Props = NativeStackScreenProps<RootStackParamList, 'OngDetalhes'>;

export default function Detalhes({ route, navigation }: Props) {
    const { paisId, nomePais } = route.params;
    const { paises } = useViagens();
    const { isDarkMode } = useTheme();
    const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);

    const pais = paises.find(item => item.id === paisId);
    const foto = pais?.fotos.find(item => item.id === fotoSelecionada);

    return (


        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.root, isDarkMode && styles.darkRoot]}
        >
            { }
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#0F172A' : '#FDF6EE'} />
            { }
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            { }


            <ScrollView contentContainerStyle={styles.modalBody}>
                <View style={[styles.modalContent, isDarkMode && styles.darkModalContent, { borderTopColor: pais?.cor || '#fff', borderTopWidth: 8 }]}> 

                    <View style={styles.headerRow}>
                        <Text style={styles.emoji}>{pais?.emoji}</Text>
                        <Text style={[styles.title, isDarkMode && styles.darkText]}>{nomePais}</Text>
                    </View>

                    <Text style={[styles.galleryHint, isDarkMode && styles.darkSecondaryText]}>Memórias registradas neste país</Text>
                    <View style={styles.gallery}>
                        {pais?.fotos.map((item) => (
                            <TouchableOpacity key={item.id} onPress={() => setFotoSelecionada(item.id)} activeOpacity={0.85}>
                                <Image source={{ uri: item.imagemUri }} style={styles.photo} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {foto && (
                        <View style={[styles.infoCard, isDarkMode && styles.darkInfoCard]}>
                            <Text style={[styles.infoTitle, isDarkMode && styles.darkText]}>{foto.local}</Text>
                            <Text style={[styles.desc, isDarkMode && styles.darkSecondaryText]}>📅 {foto.data}</Text>
                            <Text style={[styles.desc, isDarkMode && styles.darkSecondaryText]}>{foto.descricao}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.closeButtonText}>Fechar Detalhes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#ecf3ea',
    },
    darkRoot: { backgroundColor: '#0F172A' },
    darkText: { color: '#F8FAFC' },
    darkSecondaryText: { color: '#CBD5E1' },

    blob1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#a3f984',
        opacity: 0.25,
        top: -80,
        right: -80,
    },

    blob2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#76d255',
        opacity: 0.2,
        bottom: 80,
        left: -60,
    },

    modalBody: {
        flexGrow: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 24
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    darkModalContent: { backgroundColor: '#1E293B' },
    galleryHint: {
        fontSize: 14,
        color: '#6E6E6E',
        marginBottom: 12,
    },
    gallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    photo: {
        width: 130,
        height: 130,
        borderRadius: 14,
        backgroundColor: '#E5E7EB',
    },
    infoCard: {
        marginTop: 18,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#F8F3ED',
    },
    darkInfoCard: {
        backgroundColor: '#0F172A',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#3D2314',
        marginBottom: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    emoji: {
        fontSize: 32,
        marginRight: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#3D2314',
        flex: 1,
    },
    desc: {
        fontSize: 16,
        color: '#5A3A2A',
        marginBottom: 12,
    },
    closeButton: {
        backgroundColor: '#3D2314',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

