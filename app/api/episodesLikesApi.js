import apiClient from './apiClient'

export const fetchLikedEpisodes = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/likes/episodes`);
        return data.data;
    } catch (error) {
        console.error('Error fetching liked episodes: ', error);
        throw new Error('Failed to fetch liked episodes. Please try again later.');
    }
}

export const likeEpisodes = async (userId, seriesId, episodeId) => {
    try {
        const response = await apiClient.post(`/users/${userId}/likes/episodes`, { seriesId, episodeId });
        return response.data;
    } catch (error) {
        console.error('Error liking the episodes: ', error);
        throw new Error('Failed to like the episodes. Please try again later.');
    }
}

export const dislikeEpisodes = async (userId, seriesId, episodeId) => {
    try {
        const response = await apiClient.delete(`/users/${userId}/likes/episodes`, {data: { seriesId, episodeId }});
        return response.data;
    } catch (error) {
        console.error('Error liking the episodes: ', error);
        throw new Error('Failed to like the episodes. Please try again later.');
    }
}