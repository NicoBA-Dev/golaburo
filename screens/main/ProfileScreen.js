import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../../theme/colors';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    nombre: 'Cargando...',
    phone: '',
    email: '',
    avatarUrl: null,
    isTechnician: false,
  });

  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const session = await authService.getCurrentSession();
          if (!session) return;

          const currentUserId = session.user.id;
          const currentEmail = session.user.email;

          const profile = await profileService.getProfile(currentUserId);
          const techProfile = await profileService.getTechnicalProfile(currentUserId);

          setUserData({
            nombre: profile?.full_name || 'Usuario Nuevo',
            phone: profile?.phone || 'Sin número',
            email: currentEmail,
            avatarUrl: profile?.avatar_url || null,
            isTechnician: !!techProfile,
          });

          const localPrefs = await storageService.getLocalPreferences();
          setNotificationsEnabled(localPrefs.notificationsEnabled);
        } catch (error) {
          console.error('Error cargando perfil:', error);
        }
      };
      loadData();
    }, [])
  );

  const handleToggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await storageService.saveLocalPreferences(userData.email, value);
  };

  const handleClearLocalData = async () => {
    const success = await storageService.clearLocalPreferences();
    if (success) {
      setNotificationsEnabled(false);
      Alert.alert('Datos eliminados', 'Tus preferencias locales han sido borradas.');
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header Minimalista */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Mi Cuenta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Bloque Superior: Foto y Editar */}
        <View style={styles.headerProfile}>
          <View style={styles.avatarWrapper}>
            {userData.avatarUrl ? (
              <Image source={{ uri: userData.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color={colors.primarySoft} />
            )}
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{userData.nombre}</Text>
            <Text style={styles.emailText}>{userData.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="pencil" size={18} color={colors.textMain} />
          </TouchableOpacity>
        </View>

        {/* Información de Contacto */}
        <Text style={styles.sectionLabel}>MI INFORMACIÓN</Text>
        <View style={styles.cardSection}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="call" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoTitle}>Teléfono de Contacto</Text>
              <Text style={styles.infoData}>{userData.phone}</Text>
            </View>
          </View>
        </View>

        {/* Panel del Profesional (Protagonista) */}
        <Text style={styles.sectionLabel}>MODO PROFESIONAL</Text>
        <View style={styles.workerSection}>
          {!userData.isTechnician ? (
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => navigation?.navigate('RegistroTecnicoScreen')} activeOpacity={0.85}>
              <Ionicons name="briefcase-outline" size={22} color={colors.white} style={{ marginRight: 10 }} />
              <Text style={styles.actionBtnTextPrimary}>Convertirse en Profesional</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionBtnDark} onPress={() => navigation?.navigate('TecnicoPanel')} activeOpacity={0.85}>
              <Ionicons name="briefcase" size={22} color={colors.white} style={{ marginRight: 10 }} />
              <Text style={styles.actionBtnTextDark}>Ir a mi Panel de Trabajo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Configuración */}
        <Text style={styles.sectionLabel}>CONFIGURACIÓN Y APP</Text>
        <View style={styles.cardSection}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextContainer}>
              <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
                <Ionicons name="notifications-outline" size={20} color={colors.textMain} />
              </View>
              <Text style={styles.preferenceText}>Notificaciones Push</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primarySoft }}
              thumbColor={notificationsEnabled ? colors.primary : colors.textMuted}
            />
          </View>

          <TouchableOpacity style={styles.clearDataBtn} onPress={handleClearLocalData}>
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </View>
            <Text style={styles.clearDataText}>Borrar caché local</Text>
          </TouchableOpacity>
        </View>
        {/* NUEVO MÓDULO: Centro de Garantías */}
        <Text style={styles.sectionLabel}>SOPORTE Y RECLAMOS</Text>
        <View style={styles.cardSection}>
          <TouchableOpacity
            style={styles.preferenceRow}
            onPress={() => navigation.navigate('Solicitudes', { screen: 'ClaimsList' })} // Navegación cruzada al stack correcto
            activeOpacity={0.7}
          >
            <View style={styles.preferenceTextContainer}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.error} />
              </View>
              <Text style={styles.preferenceText}>Mis Garantías y Reclamos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        {/* Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <Text style={styles.logoutText}>Cerrar Sesión Segura</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarTitle: { fontSize: 18, fontWeight: '900', color: colors.textMain, letterSpacing: -0.3 },

  container: { padding: 20, paddingBottom: 40 },

  headerProfile: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 25, elevation: 2, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
  avatarWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 15, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  nameContainer: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: 'bold', color: colors.textMain, marginBottom: 4 },
  emailText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  editBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },

  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: colors.textMuted, marginBottom: 10, marginLeft: 8, letterSpacing: 1 },
  cardSection: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 25, borderWidth: 1, borderColor: colors.border },

  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoTitle: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginBottom: 2 },
  infoData: { fontSize: 16, color: colors.textMain, fontWeight: 'bold' },

  preferenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  preferenceTextContainer: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  preferenceText: { fontSize: 15, color: colors.textMain, fontWeight: '600' },

  clearDataBtn: { flexDirection: 'row', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
  clearDataText: { color: colors.error, fontSize: 15, fontWeight: 'bold' },

  workerSection: { marginBottom: 25 },
  actionBtnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, height: 60, borderRadius: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  actionBtnTextPrimary: { fontSize: 15, fontWeight: 'bold', color: colors.white, letterSpacing: 0.5 },
  actionBtnDark: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E293B', height: 60, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionBtnTextDark: { fontSize: 15, fontWeight: 'bold', color: colors.white, letterSpacing: 0.5 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, marginTop: 10 },
  logoutText: { fontSize: 15, color: colors.error, fontWeight: 'bold' },
});