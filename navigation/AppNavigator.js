import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../config/supabaseConfig';

// Pantallas
import BienvenidaScreen from '../screens/BienvenidaScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

const MIN_SPLASH_MS = 2500;

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const startedAt = Date.now();

    const finishLoading = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_SPLASH_MS - elapsed, 0);
      setTimeout(() => {
        if (isMounted.current) setIsReady(true);
      }, remaining);
    };

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted.current) return;
        if (error) {
          setAuthError(error.message);
        } else {
          setSession(data.session);
        }
      })
      .catch((err) => {
        if (isMounted.current) setAuthError(err.message);
      })
      .finally(finishLoading);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted.current) setSession(nextSession);
    });

    return () => {
      isMounted.current = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!isReady ? (
          <Stack.Screen name="Splash" component={BienvenidaScreen} />
        ) : session ? (
          /* USUARIO LOGUEADO: Solo cargamos el MainTabNavigator. 
             Las demás pantallas viven dentro de sus respectivas pestañas. */
          <Stack.Group>
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </Stack.Group>
        ) : (
          /* SIN SESIÓN */
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              initialParams={authError ? { sessionError: authError } : undefined}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}