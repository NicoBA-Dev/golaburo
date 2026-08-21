// services/userService.js
const initialUserData = {
  nombre: 'Juan Pérez',
  location: 'Cochabamba, Bolivia',
  phone: '71234567',
  email: 'juan.perez@email.com',
  isTechnician: false,
  technicianData: null,
};

let memoryUserDb = { ...initialUserData };

export const userService = {
  async getUserProfile() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...memoryUserDb }), 200);
    });
  },

  async updateUserProfile(updatedFields) {
    return new Promise((resolve) => {
      setTimeout(() => {
        memoryUserDb = { ...memoryUserDb, ...updatedFields };
        resolve({ success: true, user: { ...memoryUserDb } });
      }, 300);
    });
  },

  async registerTechnician(techInfo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        memoryUserDb = {
          ...memoryUserDb,
          isTechnician: true,
          technicianData: techInfo,
        };
        resolve({ success: true, user: { ...memoryUserDb } });
      }, 500);
    });
  },
};