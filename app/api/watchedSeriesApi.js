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

export const removeWatchedSeries = async (userId, seriesId) => {
    try {
        const { data } = await apiClient.delete(`/users/${userId}/watchedSeries`,{data: { seriesId }});
        return data;
    } catch (error) {
        console.error('Error removing series from watched series:', error);
        throw new Error('Failed to remove series from watched series. Please try again later.');
    }
};