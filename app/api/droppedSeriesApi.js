import apiClient from './apiClient'

export const fetchDroppedSeries = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/droppedSeries`);
        return data;
    } catch (error) {
        console.error('Error when fetching dropped series: ', error);
        throw new Error('Failed to fetch dropped series.')
    }
}

export const addDroppedSeries = async (userId, seriesId) => {
    try {
        const { data } = await apiClient.post(`/users/${userId}/droppedSeries`,  { seriesId });
        return data;
    } catch (error) {
        console.error('Error adding new dropped series:', error);
        throw new Error('Failed to add new dropped series. Please try again later.');
    }
}