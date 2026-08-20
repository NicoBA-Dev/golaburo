import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas del flujo de búsqueda
import ExploreScreen from '../screens/main/search/ExploreScreen';
// Usaremos el ServiceDetails que vas a mover/actualizar en el siguiente paso
import ServiceDetailsScreen from '../screens/main/search/ServiceDetailsScreen';

const SearchStack = createNativeStackNavigator();

export default function SearchStackNavigator() {
    return (
        <SearchStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            {/* Pantalla base de la pestaña Buscar */}
            <SearchStack.Screen name="Explore" component={ExploreScreen} />

            {/* Pantalla de resultados (manteniendo el Tab Bar visible) */}
            <SearchStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
        </SearchStack.Navigator>
    );
}