import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Importaremos el HomeScreen real en el siguiente paso. 
// Por ahora usamos una vista temporal para que no crashee.
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { View, Text } from 'react-native';

// Pantallas temporales para rellenar las pestañas
const PlaceholderScreen = ({ name }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: colors.textMain }}>Pantalla: {name}</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Ocultamos el header feo por defecto
                tabBarActiveTintColor: colors.primary, // Verde GoLaburo para el ícono seleccionado
                tabBarInactiveTintColor: colors.textMuted,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    elevation: 10, // Sombra en Android
                    shadowColor: '#000', // Sombra en iOS
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    // Asignación de íconos según la pestaña
                    if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Buscar') iconName = focused ? 'search' : 'search-outline';
                    else if (route.name === 'Solicitudes') iconName = focused ? 'clipboard' : 'clipboard-outline';
                    else if (route.name === 'Mensajes') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';

                    return <Ionicons name={iconName} size={24} color={color} />;
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