import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import CustomTextInput from '../../components/forms/CustomTextInput';

import { supabase } from '../../config/supabaseConfig';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';

export default function EditProfileScreen({ navigation }) {
    const [userId, setUserId] = useState(null);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const session = await authService.getCurrentSession();
                if (!session) return;

                const uid = session.user.id;
                setUserId(uid);

                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, phone, avatar_url')
                    .eq('id', uid)
                    .single();

                if (error) throw error;

                if (data) {
                    setFullName(data.full_name || '');
                    setPhone(data.phone || '');
                    setAvatarUrl(data.avatar_url || null);
                }
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const showMessage = (title, msg) => {
        if (Platform.OS === 'web') window.alert(`${title}: \n${msg}`);
        else Alert.alert(title, msg);
    };

    const handlePickAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            showMessage("Permiso denegado", "Necesitamos acceso a tu galería para cambiar la foto.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadAvatar(result.assets[0].uri);
        }
    };

    // FUNCIÓN REPARADA PARA WEB Y MÓVIL
    // FUNCIÓN REPARADA AL 100% PARA WEB Y MÓVIL
    const uploadAvatar = async (imageUri) => {
        if (!userId) return;
        setIsUploading(true);

        try {
            // 1. FORZAMOS UN NOMBRE LIMPIO: 
            // Ignoramos las rutas raras de "blob:" en la web y obligamos a que sea .jpeg
            const fileName = `${userId}-${Date.now()}.jpeg`;
            const filePath = `public/${fileName}`;

            let fileBody;

            // 2. Procesamiento de archivo según plataforma
            if (Platform.OS === 'web') {
                // En Web: Extraemos el archivo puro desde la URL temporal
                const response = await fetch(imageUri);
                fileBody = await response.blob();
            } else {
                // En Móvil: Usamos la estructura nativa FormData
                fileBody = new FormData();
                fileBody.append('file', {
                    uri: imageUri,
                    name: fileName,
                    type: 'image/jpeg',
                });
            }

            // 3. Subimos a Supabase
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, fileBody, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // 4. Obtenemos el link público para mostrarlo
            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            // 5. Guardamos en la base de datos y actualizamos la pantalla
            await profileService.updateProfile(userId, { avatar_url: publicUrl });
            setAvatarUrl(publicUrl);

            showMessage("¡Foto actualizada!", "Tu nuevo avatar se guardó correctamente.");
        } catch (error) {
            console.error("Error subiendo avatar:", error);
            if (error.message && error.message.includes('Bucket not found')) {
                showMessage("Falta configurar Supabase", "Debes crear el bucket 'avatars' en Supabase.");
            } else {
                showMessage("Error", "No pudimos subir tu foto. Intenta más tarde.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!fullName.trim() || !phone.trim()) {
            showMessage("Campos requeridos", "Por favor ingresa tu nombre y número.");
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName.trim(),
                    phone: phone.trim()
                })
                .eq('id', userId);

            if (error) throw error;

            showMessage("¡Éxito!", "Tu información se guardó correctamente.");
            navigation.goBack();

        } catch (error) {
            console.error("Error guardando perfil:", error);
            showMessage("Error", "No pudimos guardar los cambios.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} activeOpacity={0.7}>
                        <Ionicons name="close" size={28} color={colors.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                    <View style={styles.iconButton} />
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Cargando datos...</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                        <View style={styles.avatarSection}>
                            <View style={styles.avatarContainer}>
                                {isUploading ? (
                                    <View style={styles.uploadingOverlay}>
                                        <ActivityIndicator size="large" color={colors.primary} />
                                    </View>
                                ) : avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                                ) : (
                                    <Ionicons name="person" size={60} color={colors.primarySoft} />
                                )}
                            </View>
                            <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickAvatar} activeOpacity={0.8} disabled={isUploading}>
                                <Ionicons name="camera" size={18} color={colors.primary} style={{ marginRight: 6 }} />
                                <Text style={styles.changePhotoText}>
                                    {isUploading ? 'Subiendo...' : 'Cambiar foto de perfil'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionLabel}>INFORMACIÓN PERSONAL</Text>
                        <View style={styles.formSection}>
                            <CustomTextInput
                                label="Nombre Completo"
                                placeholder="Ej. Juan Pérez"
                                value={fullName}
                                onChangeText={setFullName}
                                iconName="person-outline"
                            />

                            <CustomTextInput
                                label="Número de Celular"
                                placeholder="Ej. 70012345"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                iconName="call-outline"
                            />
                        </View>

                        <View style={styles.trustNoteContainer}>
                            <Ionicons name="lock-closed" size={16} color={colors.textMuted} style={{ marginRight: 6 }} />
                            <Text style={styles.infoText}>Tus datos están seguros y solo se comparten con profesionales confirmados.</Text>
                        </View>
                    </ScrollView>
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveButton, (isSaving || isUploading || isLoading) && styles.disabledButton]}
                        onPress={handleSave}
                        activeOpacity={0.8}
                        disabled={isSaving || isUploading || isLoading}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                            <Text style={styles.saveButtonText}>GUARDAR CAMBIOS</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    keyboardView: { flex: 1 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 15, paddingVertical: 12, backgroundColor: colors.surface,
        borderBottomWidth: 1, borderBottomColor: colors.border,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    },
    iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },

    container: { padding: 20 },

    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: colors.textMuted, fontWeight: '500' },

    avatarSection: { alignItems: 'center', marginBottom: 35, marginTop: 10 },
    avatarContainer: {
        width: 130, height: 130, borderRadius: 65, backgroundColor: colors.surface,
        alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.surface,
        overflow: 'hidden', elevation: 8, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12
    },
    avatarImage: { width: '100%', height: '100%' },
    uploadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' },

    changePhotoBtn: { flexDirection: 'row', alignItems: 'center', marginTop: -20, backgroundColor: colors.surface, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    changePhotoText: { color: colors.primary, fontWeight: '900', fontSize: 13 },

    sectionLabel: { fontSize: 12, fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 8 },
    formSection: { backgroundColor: colors.surface, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },

    trustNoteContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 25, paddingHorizontal: 10 },
    infoText: { fontSize: 12, color: colors.textMuted, textAlign: 'center', flex: 1, fontWeight: '500' },

    footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    saveButton: { backgroundColor: colors.primary, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    disabledButton: { opacity: 0.6, shadowOpacity: 0, elevation: 0 },
    saveButtonText: { color: colors.white, fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 }
});