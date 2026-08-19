import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../config/supabaseConfig';

// Pantallas
import BienvenidaScreen from '../screens/BienvenidaScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Verificamos si ya hay una sesión guardada al abrir la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Le damos 2.5 segundos de vida a la pantalla de Bienvenida para que se vea la animación
      setTimeout(() => setIsReady(true), 2500);
    });

    // 2. Nos quedamos "escuchando" por si el usuario inicia o cierra sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>

        {/* ESTADO 1: Cargando (Muestra el Splash Screen) */}
        {!isReady ? (
          <Stack.Screen name="Splash" component={BienvenidaScreen} />
        )

          /* ESTADO 2: Usuario logueado (Muestra la app principal) */
          : session ? (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          )

            /* ESTADO 3: Sin sesión (Muestra Login y Registro) */
            : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}