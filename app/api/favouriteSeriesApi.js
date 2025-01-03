import apiClient from './apiClient'

export const addFavouriteSeries = async (userId, seriesId) => {
    try {
        const { data } = await apiClient.post(`/users/${userId}/favourites`, { seriesId });
        return data;
    } catch (error) {
        console.error('Error adding new favourite series:', error);
        throw new Error('Failed to add new favourite series. Please try again later.');
    }
}

export const deleteFavouriteSeries = async (id, seriesId) => {
    console.log('API userId: ', id);
    console.log('API seriesID: ', seriesId);

    try {
        const { data } = await apiClient.delete(`/users/${id}/favourites`, {data: { seriesId }});
        return data;
    } catch (error) {
        console.error('Error removing favourite series:', error);
        throw new Error('Failed to remove favourite series. Please try again later.');
    }
}