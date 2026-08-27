import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';

const INITIAL_SOLICITUDES = [
  {
    id: '1',
    titulo: 'Instalación de ducha eléctrica',
    cliente: 'María Elena G.',
    zona: 'Queru Queru (Cercado)',
    fecha: '16/08/2026 a las 09:00 AM',
    esNueva: true,
    presupuesto: 'Bs. 120 (Sujeto a cambios)',
    descripcion:
      'El lavamanos del baño de visitas gotea constantemente por debajo del sifón de plástico. Favor traer repuesto.',
    tiempoRecibido: 'Solicitud recibida hace 25 min.',
    direccionMap: 'Calle N, #123\nQueru Queru, Cochabamba',
  },
  {
    id: '2',
    titulo: 'Reparación de fuga de agua',
    cliente: 'José R.',
    zona: 'Sarco',
    fecha: '16/08/2026 a las 11:30 AM',
    esNueva: false,
    presupuesto: 'Bs. 80 (Sujeto a cambios)',
    descripcion:
      'Fuga moderada en la tubería externa del patio trasero.',
    tiempoRecibido: 'Solicitud recibida hace 1 hora.',
    direccionMap: 'Av. Juan de la Rosa #456\nSarco, Cochabamba',
  },
];

export default function TecnicoSolicitudesScreen() {
  const [solicitudes, setSolicitudes] = useState(INITIAL_SOLICITUDES);
  const [search, setSearch] = useState('');

  const handleAceptar = (id) => {
    Alert.alert('Solicitud Aceptada', 'Has aceptado la solicitud. Se notificará al cliente.');
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRechazar = (id) => {
    Alert.alert('Solicitud Rechazada', 'La solicitud ha sido descartada.');
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleNavigateMap = (direccion) => {
    Alert.alert('Navegación GPS', `Abriendo mapa con la dirección:\n${direccion}`);
  };

  const filteredSolicitudes = solicitudes.filter(
    (s) =>
      s.titulo.toLowerCase().includes(search.toLowerCase()) ||
      s.cliente.toLowerCase().includes(search.toLowerCase()) ||
      s.zona.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopBar Limpia */}
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>GO LABURO - Técnico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <InputField
          placeholder="Buscar"
          value={search}
          onChangeText={setSearch}
        />

        {filteredSolicitudes.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                <Text style={styles.boldText}>Cliente: </Text>
                {item.cliente}
              </Text>
              <Ionicons name="call-outline" size={16} color={colors.primary} style={styles.callIcon} />
            </View>

            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Zona: </Text>
              {item.zona}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Fecha/Hora: </Text>
              {item.fecha}{' '}
              {item.esNueva && <Text style={styles.badgeNueva}>(NUEVA)</Text>}
            </Text>

            <Text style={styles.infoText}>
              <Text style={styles.boldText}>Presupuesto sugerido: </Text>
              {item.presupuesto}
            </Text>

            <Text style={styles.descriptionText}>
              <Text style={styles.boldText}>Descripción del problema: </Text>
              {item.descripcion}
            </Text>

            <Text style={styles.timeText}>{item.tiempoRecibido}</Text>

            <View style={styles.actionButtonsRow}>
              <PrimaryButton
                title="RECHAZAR"
                onPress={() => handleRechazar(item.id)}
                variant="outline"
                style={styles.btnRechazar}
              />
              <PrimaryButton
                title="ACEPTAR"
                onPress={() => handleAceptar(item.id)}
                variant="primary"
                style={styles.btnAceptar}
              />
            </View>

            <View style={styles.mapWidget}>
              <View style={styles.mapInfo}>
                <Ionicons name="location" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.mapAddress}>{item.direccionMap}</Text>
              </View>
              <TouchableOpacity
                style={styles.navigateBtn}
                onPress={() => handleNavigateMap(item.direccionMap)}
              >
                <Ionicons name="navigate" size={18} color={colors.white} />
                <Text style={styles.navigateText}>NAVIGATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredSolicitudes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay solicitudes pendientes.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder || colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMain,
    marginBottom: 4,
    lineHeight: typography.lineHeight.sm,
  },
  boldText: {
    fontWeight: typography.fontWeight.bold,
  },
  callIcon: {
    marginLeft: 6,
    marginBottom: 4,
  },
  badgeNueva: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  descriptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMain,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: typography.lineHeight.base,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: 14,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  btnRechazar: {
    flex: 1,
    borderColor: colors.error,
  },
  btnAceptar: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  mapWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: 12,
    padding: 10,
  },
  mapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mapAddress: {
    fontSize: typography.fontSize.xs,
    color: colors.textMain,
    flex: 1,
  },
  navigateBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
  },
});