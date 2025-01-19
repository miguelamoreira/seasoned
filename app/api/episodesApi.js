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
        console.error('Error fetching Viewing History:', error);
        throw new Error('Failed to fetch Viewing History. Please try again later.');
    }
}

export const postViewingHistory = async (id, body)=>{
    try {
        const { data } = await apiClient.post(`/users/${id}/viewingHistory`,   body );
        return data;
    } catch (error) {
        console.error('Error adding Viewing History:', error);
        throw new Error('Failed to add new Viewing History. Please try again later.');
    }
}

export const deleteViewingHistory = async (id) => {
    try {
        const { data } = await apiClient.delete(`/users/${id}/viewingHistory`);
        return data;
    } catch (error) {
        console.error('Error deleting Viewing History:', error);
        throw new Error('Failed delete Viewing History. Please try again later.');
    }
}

export const findEpisodeBySeriesId = async (id) => {
    try {
        const { data } = await apiClient.get(`/series/${id}/episodes`);
        return data.data;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        throw new Error('Failed to fetch episodes. Please try again later.');
    }
}