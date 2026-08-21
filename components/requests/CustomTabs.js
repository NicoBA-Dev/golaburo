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
        backgroundColor: colors.disabledBg, // Fondo gris claro del theme
        borderRadius: 12,
        padding: 4,
        marginVertical: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: colors.surface, // Blanco puro
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textMuted,
    },
    activeTabText: {
        color: colors.textMain,
        fontWeight: 'bold',
    },
});