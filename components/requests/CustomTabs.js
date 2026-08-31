import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function CustomTabs({ activeTab, onTabChange }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                onPress={() => onTabChange('active')}
                activeOpacity={0.8}
            >
                <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                    En curso
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                onPress={() => onTabChange('history')}
                activeOpacity={0.8}
            >
                <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                    Historial
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.04)', // Fondo gris muy sutil y elegante
        borderRadius: 16,
        padding: 6,
        marginVertical: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: colors.surface,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3, // Sombra para Android
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMuted,
    },
    activeTabText: {
        color: colors.primary, // Texto del color principal al estar activo
        fontWeight: '900',
        letterSpacing: 0.3,
    },
});