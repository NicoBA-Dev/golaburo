import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch, Image } from 'react-native';
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

  // useFocusEffect recarga los datos cada vez que la pantalla se vuelve a mostrar
  // (Ideal para cuando regresas de EditProfileScreen)
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
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Mi Cuenta</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Cabecera del Perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {userData.avatarUrl ? (
              <Image source={{ uri: userData.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={50} color={colors.primarySoft} />
            )}
          </View>

          <Text style={styles.name}>{userData.nombre}</Text>
          <Text style={styles.emailText}>{userData.email}</Text>

          <TouchableOpacity
            style={styles.editProfileBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="pencil" size={16} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.editProfileText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjeta de Resumen de Datos */}
        <Text style={styles.sectionTitle}>Datos de Contacto</Text>
        <View style={styles.cardSection}>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={22} color={colors.textMuted} />
            <Text style={styles.infoText}>{userData.phone}</Text>
          </View>
        </View>

        {/* Preferencias */}
        <Text style={styles.sectionTitle}>Ajustes de Aplicación</Text>
        <View style={styles.cardSection}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceTextContainer}>
              <View style={styles.iconBox}>
                <Ionicons name="notifications" size={20} color={colors.primary} />
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
              <Ionicons name="trash" size={20} color={colors.error} />
            </View>
            <Text style={styles.clearDataText}>Borrar caché local</Text>
          </TouchableOpacity>
        </View>

        {/* Modo Trabajador */}
        <View style={styles.workerSection}>
          {!userData.isTechnician ? (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation?.navigate('RegistroTecnicoScreen')}
              activeOpacity={0.85}
            >
              <Text style={[styles.actionBtnText, { color: colors.white }]}>CONVERTIRSE EN PROFESIONAL</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.textMain }]}
              onPress={() => navigation?.navigate('TecnicoPanel')}
              activeOpacity={0.85}
            >
              <Ionicons name="briefcase" size={20} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={[styles.actionBtnText, { color: colors.white }]}>IR A MI PANEL DE TRABAJO</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cerrar Sesión */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <>
              <Ionicons name="log-out" size={20} color={colors.error} />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15, backgroundColor: colors.surface },
  backBtn: { padding: 4 },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
  container: { padding: 20, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: 25, paddingTop: 10 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border, overflow: 'hidden', marginBottom: 15 },
  avatarImage: { width: '100%', height: '100%' },
  name: { fontSize: 24, fontWeight: '900', color: colors.textMain, marginBottom: 4 },
  emailText: { fontSize: 14, color: colors.textMuted, marginBottom: 15 },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  editProfileText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textMuted, marginBottom: 10, marginLeft: 5, textTransform: 'uppercase' },
  cardSection: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 25, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },

  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 16, color: colors.textMain, marginLeft: 12, fontWeight: '500' },

  preferenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  preferenceTextContainer: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  preferenceText: { fontSize: 15, color: colors.textMain, marginLeft: 12, fontWeight: '600' },
  clearDataBtn: { flexDirection: 'row', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
  clearDataText: { color: colors.error, fontSize: 15, marginLeft: 12, fontWeight: '600' },

  workerSection: { marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 14, marginBottom: 15 },
  actionBtnText: { fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.errorSoft, height: 56, borderRadius: 14, marginTop: 5, marginBottom: 20 },
  logoutText: { fontSize: 15, color: colors.error, marginLeft: 8, fontWeight: 'bold' },
});