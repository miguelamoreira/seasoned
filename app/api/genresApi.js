import apiClient from './apiClient'

export const fetchGenres = async () => {
    try {
        const response = await apiClient.get('/genres');
        return response.data.data.map((genre) => ({
            id: genre.genre_id,
            name: genre.genre_name,
        }));
    } catch (error) {
        console.error('Failed to fetch genres:', error.response ? error.response.data : error.message);
        throw error; 
    }
}

export const fetchComparisonGenres = async (userId) => {
    try {
        const response = await apiClient.get(`/users/${userId}/preferredGenres`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch preferred genres:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const addPreferredGenre = async (userId, genreId) => {
    try {
        const response = await apiClient.post(`/users/${userId}/preferredGenres`, {
            genre_id: genreId,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add preferred genre:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deletePreferredGenre = async (userId, genreId) => {
    try {
        const response = await apiClient.delete(`/users/${userId}/preferredGenres`, {
            data: { genre_id: genreId }, 
        });
        return response.data; 
    } catch (error) {
        console.error('Failed to delete preferred genre:', error.response ? error.response.data : error.message);
        throw error;
    }
};