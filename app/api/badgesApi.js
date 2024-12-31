import apiClient from './apiClient'

export const fetchBadges = async (userId) => {
    try {
        const response = await apiClient.get(`/users/${userId}/badges`); 
        return response.data.data.map((badge) => ({
            id: badge.badge_id,
            name: badge.name,
            description: badge.description,
            howTo: badge.howTo,
            image: badge.image,
            earned: badge.earned
        }));
    } catch (error) {
        console.error('Failed to fetch badges:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const fetchBadgeById = async (id) => {
    try {
        const { data } = await apiClient.get(`/badges/${id}`);
        return data;
    } catch (error) {
        console.error('Error fetching badge:', error);
        throw new Error('Failed to fetch badge. Please try again later.');
    }
}

export const addEarnedBadge = async (userId, badgeId) => {
    try {
        const response = await apiClient.post(`/users/${userId}/earnedBadges`, { badgeId });
        return response.data;
    } catch (error) {
        console.error('Error awarding badge:', error.response ? error.response.data : error.message);
        throw new Error('Failed to award badge. Please try again later.');
    }
}