import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import PrimaryButton from '../../components/PrimaryButton';
import { notesService } from '../../services/notesService';

const CATEGORIES = ['Todos', 'Plomería', 'Electricidad', 'Pintura', 'Cerrajería', 'General'];
const PRIORITIES = ['Baja', 'Media', 'Alta'];

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plomería');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Media');
  const [isSaving, setIsSaving] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await notesService.getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar notas:', error);
    }
  };

  // Recarga automática al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const handleOpenModal = (note = null) => {
    if (note) {
      setEditingId(note.id);
      setTitle(note.title || '');
      setCategory(note.category || 'Plomería');
      setDescription(note.description || '');
      setPriority(note.priority || 'Media');
    } else {
      setEditingId(null);
      setTitle('');
      setCategory('Plomería');
      setDescription('');
      setPriority('Media');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validación', 'El título del recordatorio es obligatorio.');
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        await notesService.updateNote(editingId, {
          title: title.trim(),
          category,
          description: description.trim(),
          priority,
        });
      } else {
        await notesService.createNote({
          title: title.trim(),
          category,
          description: description.trim(),
          priority,
        });
      }

      await loadNotes();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo guardar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleComplete = async (item) => {
    try {
      await notesService.updateNote(item.id, { completed: !item.completed });
      await loadNotes();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('¿Deseas eliminar este recordatorio?');
      if (confirmDelete) {
        notesService.deleteNote(id).then(() => loadNotes());
      }
      return;
    }

    Alert.alert(
      'Eliminar Registro',
      '¿Estás seguro de que deseas eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await notesService.deleteNote(id);
            await loadNotes();
          },
        },
      ]
    );
  };

  const filteredNotes = notes.filter((item) => {
    const matchesCategory = filter === 'Todos' || item.category === filter;
    const matchesSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Recordatorios del Hogar</Text>
        <TouchableOpacity onPress={() => handleOpenModal()} style={styles.addIconBtn}>
          <Ionicons name="add-circle" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Buscador */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pendientes o repuestos..."
            placeholderTextColor={colors.placeholder || '#94A3B8'}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Chips de Categorías */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, filter === cat && styles.chipActive]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.chipText, filter === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Notas */}
        {filteredNotes.map((item) => (
          <View key={item.id} style={[styles.card, item.completed && styles.cardCompleted]}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => handleToggleComplete(item)}
              >
                <Ionicons
                  name={item.completed ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={item.completed ? colors.success : colors.textMuted}
                />
                <Text style={[styles.cardTitle, item.completed && styles.titleCompleted]}>
                  {item.title}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => handleOpenModal(item)} style={{ marginRight: 10 }}>
                  <Ionicons name="pencil-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>

            {item.description ? (
              <Text style={styles.cardDesc}>{item.description}</Text>
            ) : null}

            <View style={styles.cardFooter}>
              <Text style={styles.categoryBadge}>{item.category}</Text>
              <Text
                style={[
                  styles.priorityBadge,
                  item.priority === 'Alta' ? styles.priorityHigh : styles.priorityNormal,
                ]}
              >
                Prioridad {item.priority}
              </Text>
              <Text style={styles.dateText}>{item.createdAt}</Text>
            </View>
          </View>
        ))}

        {filteredNotes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No tienes recordatorios registrados.</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={() => handleOpenModal()}>
              <Text style={styles.emptyAddBtnText}>+ Crear primer recordatorio</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de Crear / Editar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Título o Tarea *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej. Comprar empaque para ducha"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Especialidad / Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.smallChip, category === c && styles.smallChipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.smallChipText, category === c && styles.smallChipTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Prioridad</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityChip, priority === p && styles.priorityChipActive]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityChipText, priority === p && styles.priorityChipTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Notas adicionales (Opcional)</Text>
            <TextInput
              style={[styles.modalInput, { height: 70, textAlignVertical: 'top' }]}
              placeholder="Medidas, modelo, observaciones..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <PrimaryButton
              title={isSaving ? 'GUARDANDO...' : editingId ? 'ACTUALIZAR RECORDATORIO' : 'GUARDAR RECORDATORIO'}
              onPress={handleSave}
              disabled={isSaving}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
  addIconBtn: { padding: 2 },
  container: { padding: 16, paddingBottom: 40 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textMain },

  chipsRow: { marginBottom: 16 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  chipTextActive: { color: colors.white },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardCompleted: { opacity: 0.6, backgroundColor: '#F8FAFC' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMain, marginLeft: 10, flex: 1 },
  titleCompleted: { textDecorationLine: 'line-through', color: colors.textMuted },
  actionsRow: { flexDirection: 'row', alignItems: 'center' },
  cardDesc: { fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  categoryBadge: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: 'bold',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityBadge: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priorityHigh: { backgroundColor: '#FEE2E2', color: colors.error },
  priorityNormal: { backgroundColor: '#F1F5F9', color: colors.textMuted },
  dateText: { fontSize: 11, color: colors.textMuted, marginLeft: 'auto' },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 14, color: colors.textMuted, marginTop: 10 },
  emptyAddBtn: { marginTop: 14, backgroundColor: colors.primarySoft, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  emptyAddBtnText: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.surface, borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.textMain, marginBottom: 6 },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textMain,
    marginBottom: 12,
  },
  smallChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  smallChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  smallChipText: { fontSize: 12, color: colors.textMuted },
  smallChipTextActive: { color: colors.white, fontWeight: 'bold' },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  priorityChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  priorityChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  priorityChipText: { fontSize: 12, color: colors.textMuted },
  priorityChipTextActive: { color: colors.white, fontWeight: 'bold' },
});