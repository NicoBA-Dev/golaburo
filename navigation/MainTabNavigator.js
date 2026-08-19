import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const PlaceholderScreen = ({ name }) => (
    <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Pantalla: {name}</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    // Calculamos los márgenes seguros del dispositivo (Notch, Home Indicator)
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true, // Oculta los tabs al abrir el teclado
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    // Altura dinámica: base + el área segura del teléfono
                    height: Platform.OS === 'ios' ? 65 + insets.bottom : 65,
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
                    paddingTop: 10,
                    // Sombra superior premium
                    elevation: 15,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarIcon: ({ focused, color }) => {
                    let iconName;

                    if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Buscar') iconName = focused ? 'search' : 'search-outline';
                    else if (route.name === 'Solicitudes') iconName = focused ? 'clipboard' : 'clipboard-outline';
                    else if (route.name === 'Mensajes') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';

                    // Efecto visual: el ícono crece ligeramente si está activo
                    return <Ionicons name={iconName} size={focused ? 26 : 24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name="Buscar">
                {() => <PlaceholderScreen name="Buscar Servicios" />}
            </Tab.Screen>
            <Tab.Screen name="Solicitudes">
                {() => <PlaceholderScreen name="Mis Solicitudes" />}
            </Tab.Screen>
            <Tab.Screen name="Mensajes">
                {() => <PlaceholderScreen name="Mensajes" />}
            </Tab.Screen>
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    placeholderText: {
        fontSize: 18,
        color: colors.textMain,
        fontWeight: '500',
    }
});