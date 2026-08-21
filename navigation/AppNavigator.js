import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../config/supabaseConfig';

// Pantallas
import BienvenidaScreen from '../screens/BienvenidaScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TecnicoSolicitudesScreen from '../screens/tecnico/TecnicoSolicitudesScreen';
import TecnicoHistorialScreen from '../screens/tecnico/TecnicoHistorialScreen';
import PerfilTecnicoScreen from '../screens/main/PerfilTecnicoScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

// Tiempo mínimo que se muestra el splash, para que la animación de
// bienvenida no "parpadee" si Supabase responde muy rápido.
const MIN_SPLASH_MS = 2500;

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Evita setState sobre un componente ya desmontado si el usuario
  // navega/cierra la app durante la carga inicial.
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

    // 1. Verificamos si ya hay una sesión guardada al abrir la app
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

    // 2. Nos quedamos "escuchando" por si el usuario inicia o cierra sesión
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
        {/* ESTADO 1: Cargando (Muestra el Splash Screen) */}
        {!isReady ? (
          <Stack.Screen name="Splash" component={BienvenidaScreen} />
        ) : /* ESTADO 2: Usuario logueado (Muestra la app principal y la vista independiente del técnico) */
          session ? (
            <>
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name="PerfilTecnicoStack" component={PerfilTecnicoScreen} />
              <Stack.Screen name="TecnicoSolicitudesScreen" component={TecnicoSolicitudesScreen} />
              <Stack.Screen name="TecnicoHistorialScreen" component={TecnicoHistorialScreen} />
            </>
          ) : (
            /* ESTADO 3: Sin sesión (Muestra Login y Registro) */
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                initialParams={authError ? { sessionError: authError } : undefined}
              />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}