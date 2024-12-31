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