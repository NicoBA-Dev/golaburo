import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas del flujo de Búsqueda y Resultados
import ExploreScreen from '../screens/main/search/ExploreScreen';
import ServiceDetailsScreen from '../screens/main/search/ServiceDetailsScreen';

// NUEVA: Pantalla del perfil del trabajador
import TechnicianProfileScreen from '../screens/main/search/TechnicianProfileScreen';

// Pantallas del flujo de Creación de Solicitud
import CreateRequestScreen from '../screens/main/requests/CreateRequestScreen';
import RequestSuccessScreen from '../screens/main/requests/RequestSuccessScreen';

const SearchStack = createNativeStackNavigator();

export default function SearchStackNavigator() {
    return (
        <SearchStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            {/* 1. Buscador estilo Spotify */}
            <SearchStack.Screen name="Explore" component={ExploreScreen} />

            {/* 2. Lista de resultados (Técnicos) */}
            <SearchStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />

            {/* 3. Perfil detallado del técnico */}
            <SearchStack.Screen name="TechnicianProfile" component={TechnicianProfileScreen} />

            {/* 4. Formulario para solicitar el servicio */}
            <SearchStack.Screen name="CreateRequest" component={CreateRequestScreen} />

            {/* 5. Ticket de éxito (animación suave) */}
            <SearchStack.Screen
                name="RequestSuccess"
                component={RequestSuccessScreen}
                options={{ animation: 'fade' }}
            />
        </SearchStack.Navigator>
    );
}