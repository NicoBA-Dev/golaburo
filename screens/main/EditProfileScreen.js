import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
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

                // Consultamos a la base de datos
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

    const handlePickAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permiso denegado", "Necesitamos acceso a tu galería.");
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

    const uploadAvatar = async (imageUri) => {
        if (!userId) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            const fileExt = imageUri.split('.').pop() || 'jpeg';
            const fileName = `${userId}-${Date.now()}.${fileExt}`;

            formData.append('file', {
                uri: imageUri,
                name: fileName,
                type: `image/${fileExt}`,
            });

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(`public/${fileName}`, formData, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(`public/${fileName}`);

            const publicUrl = publicUrlData.publicUrl;

            // Actualizamos la tabla profiles con la nueva URL
            await profileService.updateProfile(userId, { avatar_url: publicUrl });
            setAvatarUrl(publicUrl);

            Alert.alert("¡Foto actualizada!", "Tu avatar se subió correctamente.");
        } catch (error) {
            console.error("Error subiendo avatar:", error);
            Alert.alert("Error", "No pudimos subir tu foto.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!fullName.trim() || !phone.trim()) {
            Alert.alert("Campos requeridos", "Por favor ingresa tu nombre y número.");
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

            Alert.alert("¡Éxito!", "Tu información se guardó correctamente.");
            navigation.goBack(); // Volvemos a la pantalla principal de perfil

        } catch (error) {
            console.error("Error guardando perfil:", error);
            Alert.alert("Error", "No pudimos guardar los cambios.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="close" size={26} color={colors.textMain} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                    <View style={{ width: 26 }} />
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                ) : (
                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                        {/* Selector de Foto */}
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarContainer}>
                                {isUploading ? (
                                    <ActivityIndicator size="large" color={colors.primary} />
                                ) : avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                                ) : (
                                    <Ionicons name="person" size={50} color={colors.primarySoft} />
                                )}
                            </View>
                            <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickAvatar}>
                                <Ionicons name="camera-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
                                <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Formulario */}
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

                        <Text style={styles.infoText}>
                            Este número será utilizado por los profesionales para contactarte cuando acepten tu solicitud.
                        </Text>
                    </ScrollView>
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveButton, (isSaving || isUploading) && styles.disabledButton]}
                        onPress={handleSave}
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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
    backButton: { padding: 5, marginLeft: -5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
    container: { padding: 20 },

    avatarSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
    avatarContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary, overflow: 'hidden', elevation: 4, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    avatarImage: { width: '100%', height: '100%' },
    changePhotoBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: colors.primarySoft, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    changePhotoText: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },

    infoText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 20 },
    footer: { padding: 20, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    saveButton: { backgroundColor: colors.primary, height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { opacity: 0.7 },
    saveButtonText: { color: colors.white, fontSize: 15, fontWeight: 'bold' }
});