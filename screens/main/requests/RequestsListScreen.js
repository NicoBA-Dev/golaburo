import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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

    // Estados reales
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clientId, setClientId] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // 1. Obtener el ID del cliente al cargar la pantalla
    useEffect(() => {
        const fetchSession = async () => {
            const session = await authService.getCurrentSession();
            if (session) setClientId(session.user.id);
        };
        fetchSession();
    }, []);

    // 2. useFocusEffect recarga la lista automáticamente cada vez que entras a esta pestaña
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
            // Hacemos un JOIN en Supabase para traer la categoría y el nombre del técnico
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
                    )
                `)
                .eq('client_id', clientId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error descargando solicitudes:', error);
            Alert.alert('Error', 'No pudimos cargar tus solicitudes recientes.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Lógica para filtrar pestañas ('active' vs 'history')
    // pending/accepted van a "En curso" | completed/rejected van a "Historial"
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
            // Guardamos la reseña real en Supabase
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    service_request_id: selectedRequest.id,
                    client_id: clientId,
                    technician_id: selectedRequest.technician_id,
                    rating: rating,
                    comment: review
                }]);

            if (error) throw error;

            Alert.alert(
                "¡Gracias por tu opinión!",
                `Tu calificación ha sido enviada exitosamente.`,
                [{ text: "Entendido", style: "default" }]
            );

            // Refrescamos la lista para actualizar la interfaz
            fetchRealRequests();

        } catch (error) {
            console.error("Error al enviar reseña:", error);
            Alert.alert("Ups", "No pudimos enviar tu calificación. Intenta de nuevo más tarde.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Mis Solicitudes</Text>

                <CustomTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={filteredRequests}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            // Mapeamos los datos de Supabase a lo que tu componente RequestCard espera
                            const serviceName = item.categories?.name || 'Servicio';
                            const techName = item.technical_profiles?.profiles?.full_name || 'Técnico';
                            // Ajuste visual: Si está 'completed' marcamos el status para RequestCard
                            const cardStatus = item.status === 'completed' ? 'completed' : 'active';

                            return (
                                <RequestCard
                                    service={serviceName}
                                    technician={techName}
                                    date={item.suggested_date}
                                    status={cardStatus}
                                    isRated={false} // Por ahora en falso, luego podemos cruzarlo con la tabla reviews
                                    onPress={() => navigation.navigate('RequestStatus', { requestData: item })}
                                    onRatePress={() => handleRatePress({ ...item, technicianName: techName })}
                                />
                            );
                        }}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                No tienes solicitudes {activeTab === 'active' ? 'en curso' : 'en el historial'}.
                            </Text>
                        }
                    />
                )}
            </View>

            {/* Modal de Calificación de tu plan de UI */}
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
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textMain },
    listContent: { paddingBottom: 40 },
    emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 40, fontSize: 14 }
});