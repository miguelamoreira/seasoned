import apiClient from './apiClient'

export const login = async ({ email, password }) => {
    try {
        const { data } = await apiClient.post('/users/login', { email, password });

        if (data.success) {
          return { success: true, accessToken: data.accessToken, loggedUserId: data.loggedUserId };
        }

        throw new Error('Invalid credentials');
    } catch (error) {
        console.log('Login failed:', error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await apiClient.post('/users', userData);
        console.log('User created successfully!'); 
        return response.data;
    } catch (error) {
        console.error("User creation failed:", error.response ? error.response.data : error.message);
        throw error; 
    }
};