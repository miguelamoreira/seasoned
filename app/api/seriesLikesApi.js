import apiClient from './apiClient'

export const fetchLikedSeries = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/likes/series`);
        return data.data;
    } catch (error) {
        console.error('Error fetching liked series: ', error);
        throw new Error('Failed to fetch liked series. Please try again later.');
    }
}

export const likeSeries = async (userId, seriesId) => {
    try {
        const response = await apiClient.post(`/users/${userId}/likes/series`, { seriesId });
        return response.data;
    } catch (error) {
        console.error('Error liking the series: ', error);
        throw new Error('Failed to like the series. Please try again later.');
    }
}

export const dislikeSeries = async (userId, seriesId) => {
    try {
        const response = await apiClient.delete(`/users/${userId}/likes/series`, { seriesId });
        return response.data;
    } catch (error) {
        console.error('Error liking the series: ', error);
        throw new Error('Failed to like the series. Please try again later.');
    }
}