import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert } from 'react-native';
import { colors } from '../../../theme/colors';
import CustomTabs from '../../../components/requests/CustomTabs';
import RequestCard from '../../../components/requests/RequestCard';
import RatingModal from '../../../components/requests/RatingModal';

// Mismos datos, pero ahora los usaremos como estado inicial
const INITIAL_REQUESTS = [
    // ACTIVOS
    { id: '1', service: 'Electricidad - Tablero General', technician: 'Pedro Vargas', date: '21/08/2026', status: 'active', step: 2, isRated: false, price: '120' },
    { id: '2', service: 'Plomería - Fuga en tubería', technician: 'Luis Choque', date: '22/08/2026', status: 'active', step: 1, isRated: false, price: '80' },
    { id: '3', service: 'Reparación de Lavadora', technician: 'Ana Morales', date: '24/08/2026', status: 'active', step: 0, isRated: false, price: '150' },

    // HISTORIAL (Concluidos)
    { id: '4', service: 'Instalación de Ducha', technician: 'Juan Pérez', date: '05/08/2026', status: 'completed', step: 3, isRated: false, price: '60' },
    { id: '5', service: 'Cerrajería - Cambio de chapa', technician: 'Carlos Mamani', date: '10/07/2026', status: 'completed', step: 3, isRated: true, price: '90' },
    { id: '6', service: 'Pintura - Interiores', technician: 'Roberto Rocha', date: '15/06/2026', status: 'completed', step: 3, isRated: true, price: '450' },
];

export default function RequestsListScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('active');

    // 1. Convertimos los datos estáticos en un estado dinámico
    const [requests, setRequests] = useState(INITIAL_REQUESTS);

    const [modalVisible, setModalVisible] = useState(false);

    // 2. Ahora guardamos todo el objeto de la orden, no solo el nombre
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Filtramos la lista según la pestaña activa
    const filteredRequests = requests.filter(req =>
        activeTab === 'active' ? req.status === 'active' : req.status === 'completed'
    );

    const handleRatePress = (requestItem) => {
        setSelectedRequest(requestItem);
        setModalVisible(true);
    };

    const handleRatingSubmit = (rating, review) => {
        // 3. Actualizamos la tarjeta específica en nuestra lista
        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === selectedRequest.id
                    ? { ...req, isRated: true } // Cambiamos el estado a calificado
                    : req
            )
        );

        setModalVisible(false);

        // 4. Feedback premium para el usuario
        setTimeout(() => {
            Alert.alert(
                "¡Gracias por tu opinión!",
                `Has calificado a ${selectedRequest.technician} con ${rating} estrellas.`,
                [{ text: "Entendido", style: "default" }]
            );
        }, 500); // Pequeño retraso para que la animación del modal termine primero
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Mis Solicitudes</Text>

                <CustomTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <FlatList
                    data={filteredRequests}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <RequestCard
                            service={item.service}
                            technician={item.technician}
                            date={item.date}
                            status={item.status}
                            isRated={item.isRated}
                            onPress={() => navigation.navigate('RequestStatus', { requestData: item })}
                            // Le pasamos todo el objeto 'item' a la función
                            onRatePress={() => handleRatePress(item)}
                        />
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No tienes solicitudes {activeTab === 'active' ? 'en curso' : 'en el historial'}.
                        </Text>
                    }
                />
            </View>

            {/* Modal de Calificación */}
            <RatingModal
                visible={modalVisible}
                // Evitamos errores si selectedRequest es null
                technicianName={selectedRequest?.technician || ''}
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