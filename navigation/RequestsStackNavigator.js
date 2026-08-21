import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RequestsListScreen from '../screens/main/requests/RequestsListScreen';
import RequestStatusScreen from '../screens/main/requests/RequestStatusScreen';

const RequestsStack = createNativeStackNavigator();

export default function RequestsStackNavigator() {
    return (
        <RequestsStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <RequestsStack.Screen name="RequestsList" component={RequestsListScreen} />
            <RequestsStack.Screen name="RequestStatus" component={RequestStatusScreen} />
        </RequestsStack.Navigator>
    );
}