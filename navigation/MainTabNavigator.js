import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontSize, fontWeight } from '../theme/typography';

import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Mapa de íconos por pestaña (activo / inactivo). Vive fuera del
// componente para no recrearse en cada render.
const TAB_ICONS = {
    Inicio: { active: 'home', inactive: 'home-outline' },
    Buscar: { active: 'search', inactive: 'search-outline' },
    Solicitudes: { active: 'clipboard', inactive: 'clipboard-outline' },
    Mensajes: { active: 'chatbubble', inactive: 'chatbubble-outline' },
    Perfil: { active: 'person', inactive: 'person-outline' },
};

// Pantalla temporal, con mejor jerarquía visual, mientras se construyen
// las secciones reales de la app.
function PlaceholderScreen({ name, icon }) {
    return (
        <View style={placeholderStyles.container}>
            <View style={placeholderStyles.iconCircle}>
                <Ionicons name={icon || 'construct-outline'} size={30} color={colors.primary} />
            </View>
            <Text style={placeholderStyles.title}>{name}</Text>
            <Text style={placeholderStyles.subtitle}>Esta sección estará disponible muy pronto.</Text>
        </View>
    );
}

const placeholderStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 32,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textMain,
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
        textAlign: 'center',
    },
});

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const insets = useSafeAreaInsets();
    // Altura base + el "safe area" inferior (barra de gestos / home indicator)
    const tabBarHeight = 56 + (insets.bottom || (Platform.OS === 'ios' ? 20 : 0));

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: tabBarHeight,
                    paddingBottom: Math.max(insets.bottom, 8),
                    paddingTop: 8,
                    elevation: 10,
                    shadowColor: colors.shadow,
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: -2 },
                },
                tabBarLabelStyle: {
                    fontSize: fontSize.xs,
                    fontWeight: fontWeight.medium,
                    marginTop: -2,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = TAB_ICONS[route.name];
                    const iconName = focused ? icons?.active : icons?.inactive;
                    return <Ionicons name={iconName} size={size ?? 23} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} />

            <Tab.Screen name="Buscar">
                {() => <PlaceholderScreen name="Buscar servicios" icon="search-outline" />}
            </Tab.Screen>

            <Tab.Screen
                name="Solicitudes"
                options={{
                    // Ejemplo de badge de notificaciones: reemplaza `undefined`
                    // por un número (ej. tabBarBadge: 3) cuando tengas datos reales.
                    tabBarBadge: undefined,
                    tabBarBadgeStyle: { backgroundColor: colors.secondary, fontSize: fontSize.xs },
                }}
            >
                {() => <PlaceholderScreen name="Mis solicitudes" icon="clipboard-outline" />}
            </Tab.Screen>

            <Tab.Screen
                name="Mensajes"
                options={{
                    tabBarBadge: undefined,
                    tabBarBadgeStyle: { backgroundColor: colors.secondary, fontSize: fontSize.xs },
                }}
            >
                {() => <PlaceholderScreen name="Mensajes" icon="chatbubble-outline" />}
            </Tab.Screen>

            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}