import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { fontSize, fontWeight } from '../theme/typography';

// Pantallas del Técnico (PerfilTecnicoScreen movido a /tecnico/)
import TecnicoSolicitudesScreen from '../screens/tecnico/TecnicoSolicitudesScreen';
import TecnicoHistorialScreen from '../screens/tecnico/TecnicoHistorialScreen';
import PerfilTecnicoScreen from '../screens/tecnico/PerfilTecnicoScreen'; // <-- NUEVA RUTA MOVIDA

const TECH_TAB_ICONS = {
  SolicitudesTab: { active: 'clipboard', inactive: 'clipboard-outline' },
  HistorialTab: { active: 'time', inactive: 'time-outline' },
  PerfilTecnicoTab: { active: 'person', inactive: 'person-outline' },
};

const Tab = createBottomTabNavigator();

export default function TecnicoTabNavigator() {
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
          const icons = TECH_TAB_ICONS[route.name];
          const iconName = focused ? icons?.active : icons?.inactive;
          return <Ionicons name={iconName} size={size ?? 23} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="SolicitudesTab"
        component={TecnicoSolicitudesScreen}
        options={{ tabBarLabel: 'Solicitudes' }}
      />
      <Tab.Screen
        name="HistorialTab"
        component={TecnicoHistorialScreen}
        options={{ tabBarLabel: 'Historial' }}
      />
      <Tab.Screen
        name="PerfilTecnicoTab"
        component={PerfilTecnicoScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}