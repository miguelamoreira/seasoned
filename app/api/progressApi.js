import apiClient from './apiClient'

export const getSeriesProgress = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/seriesProgress`);
        
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user. Please try again later.');
    }
}