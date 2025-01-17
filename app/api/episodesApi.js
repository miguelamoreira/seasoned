import apiClient from './apiClient'

export const findEpisodeById = async (id) => {
    try {
        const { data } = await apiClient.get(`/episodes/${id}`);
        return data.data;
    } catch (error) {
        console.error('Error fetching episode:', error);
        throw new Error('Failed to fetch episode. Please try again later.');
    }
}

export const getViewingHistory = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/viewingHistory`);

        
        return data.data;
    } catch (error) {
        console.error('Error fetching episode:', error);
        throw new Error('Failed to fetch episode. Please try again later.');
    }
}