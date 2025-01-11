import apiClient from './apiClient'

export const findSeriesById = async (id) => {
    try {
        const { data } = await apiClient.get(`/series/${id}`);
        return data.data;
    } catch (error) {
        console.error('Error fetching series:', error);
        throw new Error('Failed to fetch series. Please try again later.');
    }
}