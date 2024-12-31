import apiClient from './apiClient'

export const findUserById = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}`);
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user. Please try again later.');
    }
}