import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nutrilife_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear on login or register failure
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('nutrilife_token');
        localStorage.removeItem('nutrilife_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Profile Services
export const profileService = {
  createProfile: (data) => api.post('/profile', data),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data)
};

// Preferences Services
export const preferenceService = {
  setFoodPreference: (preference_type) => api.post('/preferences', { preference_type }),
  getPreferences: () => api.get('/preferences'),
  updateWeeklySchedule: (schedule) => api.put('/preferences/weekly', { schedule })
};

// Meals Services
export const mealService = {
  getSuggestions: (day, mealType) => api.get('/meals/suggestions', { params: { day, meal_type: mealType } }),
  getAllMeals: (params) => api.get('/meals', { params }),
  getMealById: (id) => api.get(`/meals/${id}`),
  saveMeal: (meal_id) => api.post('/meals/save', { meal_id }),
  getSavedMeals: () => api.get('/meals/saved'),
  deleteSavedMeal: (mealId) => api.delete(`/meals/saved/${mealId}`)
};

// Dashboard Services
export const dashboardService = {
  getDashboardData: () => api.get('/dashboard')
};

export default api;
