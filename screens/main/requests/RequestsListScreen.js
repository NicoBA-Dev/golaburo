import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

// Componentes
import CustomTabs from '../../../components/requests/CustomTabs';
import RequestCard from '../../../components/requests/RequestCard';
import RatingModal from '../../../components/requests/RatingModal';

// Servicios de Backend
import { supabase } from '../../../config/supabaseConfig';
import { authService } from '../../../services/authService';

export default function RequestsListScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('active');

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clientId, setClientId] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await authService.getCurrentSession();
            if (session) setClientId(session.user.id);
        };
        fetchSession();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (clientId) {
                fetchRealRequests();
            }
        }, [clientId])
    );

    const fetchRealRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('service_requests')
                .select(`
                    id,
                    description,
                    suggested_date,
                    status,
                    technician_id,
                    categories ( name ),
                    technical_profiles (
                        profiles ( full_name )
                    ),
                    reviews ( id ) 
                `)
                .eq('client_id', clientId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error descargando solicitudes:', error);
            const errMsg = 'No pudimos cargar tus solicitudes.';
            if (Platform.OS === 'web') window.alert(errMsg);
            else Alert.alert('Error', errMsg);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        if (activeTab === 'active') {
            return req.status === 'pending' || req.status === 'accepted';
        } else {
            return req.status === 'completed' || req.status === 'rejected';
        }
    });

    const handleRatePress = (requestItem) => {
        setSelectedRequest(requestItem);
        setModalVisible(true);
    };

    const handleRatingSubmit = async (rating, review) => {
        setModalVisible(false);

        try {
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    service_request_id: selectedRequest.id,
                    client_id: clientId,
                    technician_id: selectedRequest.technician_id,
                    rating: rating,
                    comment: review.trim() || null
                }]);

            if (error) throw error;

            const successMsg = "Tu calificación ha sido enviada exitosamente. El promedio del profesional se actualizará automáticamente.";
            if (Platform.OS === 'web') window.alert(`¡Gracias por tu opinión! ${successMsg}`);
            else Alert.alert("¡Gracias por tu opinión!", successMsg, [{ text: "Entendido", style: "default" }]);

            fetchRealRequests();

        } catch (error) {
            console.error("Error al enviar reseña:", error);
            const errMsg = "No pudimos enviar tu calificación. Verifica tu conexión.";
            if (Platform.OS === 'web') window.alert(errMsg);
            else Alert.alert("Ups", errMsg);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
            <View style={styles.container}>

                {/* Cabecera Premium */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Mis Solicitudes</Text>
                    <Text style={styles.headerSubtitle}>
                        Gestiona y califica tus servicios
                    </Text>
                </View>

                <CustomTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Actualizando bandeja...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredRequests}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const serviceName = item.categories?.name || 'Servicio';
                            const techName = item.technical_profiles?.profiles?.full_name || 'Técnico';

                            // Pasamos el estado real (pending, accepted, completed, rejected)
                            // para que el RequestCard lo pinte con el color correcto.
                            const actualStatus = item.status;

                            const isAlreadyRated = Array.isArray(item.reviews) ? item.reviews.length > 0 : item.reviews !== null;

                            return (
                                <RequestCard
                                    service={serviceName}
                                    technician={techName}
                                    date={item.suggested_date}
                                    status={actualStatus}
                                    isRated={isAlreadyRated}
                                    onPress={() => navigation.navigate('RequestStatus', { requestData: item })}
                                    onRatePress={() => handleRatePress({ ...item, technicianName: techName })}
                                />
                            );
                        }}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconCircle}>
                                    <Ionicons name="clipboard-outline" size={40} color={colors.primary} />
                                </View>
                                <Text style={styles.emptyTitle}>Sin solicitudes</Text>
                                <Text style={styles.emptyText}>
                                    No tienes servicios {activeTab === 'active' ? 'en curso en este momento' : 'en tu historial'}.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            <RatingModal
                visible={modalVisible}
                technicianName={selectedRequest?.technicianName || ''}
                onClose={() => setModalVisible(false)}
                onSubmit={handleRatingSubmit}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },

    headerContainer: { marginBottom: 5 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: colors.textMain, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 15, color: colors.textMuted, marginTop: 4, fontWeight: '500' },

    listContent: { paddingBottom: 40 },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
    loadingText: { marginTop: 15, color: colors.textMuted, fontSize: 15, fontWeight: '500' },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 30 },
    emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textMain, marginBottom: 8 },
    emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 15, lineHeight: 22 }
});