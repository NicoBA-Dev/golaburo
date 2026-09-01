import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RequestsListScreen from '../screens/main/requests/RequestsListScreen';
import RequestStatusScreen from '../screens/main/requests/RequestStatusScreen';

// NUEVO MÓDULO: Garantías y Reclamos
import ClaimsListScreen from '../screens/main/claims/ClaimsListScreen';
import CreateClaimScreen from '../screens/main/claims/CreateClaimScreen';

const RequestsStack = createNativeStackNavigator();

export default function RequestsStackNavigator() {
    return (
        <RequestsStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <RequestsStack.Screen name="RequestsList" component={RequestsListScreen} />
            <RequestsStack.Screen name="RequestStatus" component={RequestStatusScreen} />

            {/* Pantallas del nuevo módulo */}
            <RequestsStack.Screen name="ClaimsList" component={ClaimsListScreen} />
            <RequestsStack.Screen name="CreateClaim" component={CreateClaimScreen} />
        </RequestsStack.Navigator>
    );
}