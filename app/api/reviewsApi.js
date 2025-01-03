import apiClient from './apiClient'

export const fetchRatingsGroupedByScore = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/ratings`);
        return data.data;
    } catch (error) {
        console.error('Error fetching ratings grouped by score: ', error);
        throw new Error('Failed to fetch ratings grouped by score. Please try again later.');
    }
}