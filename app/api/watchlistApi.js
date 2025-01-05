import apiClient from './apiClient'

export const fetchWatchlist = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/watchlist`);
        return data;
    } catch (error) {
        console.error('Error when fetching watchlist: ', error);
        throw new Error('Failed to fetch watchlist.')
    }
}

export const addWatchlist = async (userId, seriesId) => {
    try {
        const { data } = await apiClient.post(`/users/${userId}/watchlist`,  { seriesId });
        return data;
    } catch (error) {
        console.error('Error adding new series to watchlist:', error);
        throw new Error('Failed to add new  series to watchlist. Please try again later.');
    }
}