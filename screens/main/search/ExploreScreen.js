import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');

// Categorías con colores vibrantes y contrastantes (Estilo Spotify)
const DISCOVER_CATEGORIES = [
    { id: '1', title: 'Plomería', color: '#FF7D7D', icon: 'water' },
    { id: '2', title: 'Electricidad', color: '#FFB84C', icon: 'flash' },
    { id: '3', title: 'Cerrajería', color: '#2AB3C0', icon: 'key' },
    { id: '4', title: 'Pintura', color: '#8A84FF', icon: 'color-palette' },
    { id: '5', title: 'Limpieza', color: '#FF6492', icon: 'sparkles' },
    { id: '6', title: 'Equipos', color: '#758283', icon: 'hardware-chip' },
];

export default function ExploreScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleCategoryPress = (title) => {
        // Viaja a la pantalla de detalles enviando el título seleccionado
        navigation.navigate('ServiceDetails', { serviceTitle: title });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                <Text style={styles.headerTitle}>Buscar</Text>

                {/* Barra de Búsqueda Principal */}
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={24} color={colors.textMain} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="¿Qué necesitas en Cochabamba?"
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                </View>

                <Text style={styles.sectionTitle}>Explorar categorías</Text>

                {/* Cuadrícula de Bloques de Colores */}
                <View style={styles.grid}>
                    {DISCOVER_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.tile, { backgroundColor: cat.color }]}
                            activeOpacity={0.8}
                            onPress={() => handleCategoryPress(cat.title)}
                        >
                            <Text style={styles.tileText}>{cat.title}</Text>
                            {/* Ícono gigante y rotado en la esquina inferior (Efecto Spotify) */}
                            <Ionicons name={cat.icon} size={55} color="rgba(255,255,255,0.25)" style={styles.tileIcon} />
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background
    },
    scroll: {
        padding: 20,
        paddingBottom: 40
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 20,
        marginTop: 10
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        height: 55,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 35,
        // Sombra suave para darle profundidad a la barra
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }
    },
    searchIcon: {
        marginRight: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.textMain,
        fontWeight: '500'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 15
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    tile: {
        width: (width - 55) / 2, // Calcula el ancho exacto para 2 columnas con márgenes
        height: 110,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        overflow: 'hidden', // Fundamental para que el ícono no se salga del bloque
    },
    tileText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        zIndex: 2
    },
    tileIcon: {
        position: 'absolute',
        bottom: -15,
        right: -15,
        transform: [{ rotate: '20deg' }],
        zIndex: 1
    }
});