import apiClient from './apiClient'

export const fetchFollowedSeries = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/followedSeries`);
        return data;
    } catch (error) {
        console.error('Error when fetching followed series: ', error);
        throw new Error('Failed to fetch followed series.')
    }
}

export const addFollowedSeries = async (userId, seriesId) => {
    try {
        const { data } = await apiClient.post(`/users/${userId}/followedSeries`,  { seriesId });
        return data;
    } catch (error) {
        console.error('Error adding new followed series:', error);
        throw new Error('Failed to add new followed series. Please try again later.');
    }
}