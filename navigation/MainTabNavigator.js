import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontSize, fontWeight } from '../theme/typography';

// Pantallas principales y Perfil
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen'; // <-- NUEVA PANTALLA AGREGADA
import RegistroTecnicoScreen from '../screens/main/RegistroTecnicoScreen';
import PerfilTecnicoScreen from '../screens/main/PerfilTecnicoScreen';

// Stacks anidados
import SearchStackNavigator from './SearchStackNavigator';
import RequestsStackNavigator from './RequestsStackNavigator';

// 1. Mapa de íconos por pestaña
const TAB_ICONS = {
    Inicio: { active: 'home', inactive: 'home-outline' },
    Buscar: { active: 'search', inactive: 'search-outline' },
    Solicitudes: { active: 'clipboard', inactive: 'clipboard-outline' },
    Perfil: { active: 'person', inactive: 'person-outline' },
};

// 2. Stack interno para el flujo del Perfil
const ProfileStack = createNativeStackNavigator();

function ProfileStackNavigator() {
    return (
        // Añadida animación suave para transiciones más premium
        <ProfileStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
            <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
            <ProfileStack.Screen name="RegistroTecnicoScreen" component={RegistroTecnicoScreen} />
            <ProfileStack.Screen name="PerfilTecnicoScreen" component={PerfilTecnicoScreen} />
        </ProfileStack.Navigator>
    );
}

// 3. Navegador principal por pestañas (Tab Navigator)
const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const insets = useSafeAreaInsets();
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

            {/* BUSCADOR */}
            <Tab.Screen
                name="Buscar"
                component={SearchStackNavigator}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Buscar', { screen: 'Explore' });
                    },
                })}
            />

            {/* SOLICITUDES */}
            <Tab.Screen
                name="Solicitudes"
                component={RequestsStackNavigator}
                options={{
                    tabBarBadge: undefined,
                    tabBarBadgeStyle: { backgroundColor: colors.secondary || colors.primary, fontSize: fontSize.xs || 11 },
                }}
            />

            {/* PERFIL */}
            <Tab.Screen name="Perfil" component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
}