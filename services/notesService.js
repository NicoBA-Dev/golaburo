import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@golaburo_maintenance_notes';

// READ: Obtener todas las notas
export const getNotes = async () => {
  try {
    const json = await AsyncStorage.getItem(NOTES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error al leer notas:', error);
    return [];
  }
};

// CREATE: Guardar una nueva nota
export const createNote = async ({ title, category, description, priority }) => {
  try {
    const currentNotes = await getNotes();
    const newNote = {
      id: Date.now().toString(),
      title,
      category: category || 'General',
      description: description || '',
      priority: priority || 'Media',
      completed: false,
      createdAt: new Date().toLocaleDateString('es-ES'),
    };
    const updated = [newNote, ...currentNotes];
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return newNote;
  } catch (error) {
    console.error('Error al crear nota:', error);
    throw new Error('No se pudo guardar la nota en la memoria local.');
  }
};

// UPDATE: Modificar datos o marcar como completado
export const updateNote = async (id, updatedFields) => {
  try {
    const currentNotes = await getNotes();
    const updated = currentNotes.map((note) =>
      note.id === id ? { ...note, ...updatedFields } : note
    );
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error al actualizar nota:', error);
    throw new Error('No se pudo actualizar la nota.');
  }
};

// DELETE: Eliminar una nota
export const deleteNote = async (id) => {
  try {
    const currentNotes = await getNotes();
    const filtered = currentNotes.filter((note) => note.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error al eliminar nota:', error);
    throw new Error('No se pudo eliminar la nota.');
  }
};

export const notesService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};  