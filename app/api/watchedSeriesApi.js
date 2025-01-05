import apiClient from './apiClient'

export const fetchWatchedSeries = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/watchedSeries`);
        return data;
    } catch (error) {
        console.error('Error when fetching watched series: ', error);
        throw new Error('Failed to fetch watched series.')
    }
}

export const addWatchedSeries = async (userId, seriesId) => {
    try {
        const { data } = await apiClient.post(`/users/${userId}/watchedSeries`,  { seriesId });
        return data;
    } catch (error) {
        console.error('Error adding new watched series:', error);
        throw new Error('Failed to add new watched series. Please try again later.');
    }
}