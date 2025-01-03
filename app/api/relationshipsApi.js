import apiClient from './apiClient'

export const getFollowingUsers = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/following`);
        return data.data;
    } catch (error) {
        console.error('Error fetching following users:', error);
        throw new Error('Failed to fetch following users. Please try again later.');
    }
};

export const getFollowers = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/followers`);
        return data.data;
    } catch (error) {
        console.error('Error fetching followers:', error);
        throw new Error('Failed to fetch followers. Please try again later.');
    }
};

export const addFollowing = async (user1_id, user2_id) => {
    try {
        const { data } = await apiClient.post(`/users/${user1_id}/following`, user2_id);
        return data;
    } catch (error) {
        console.error('Error adding following:', error);
        throw new Error('Failed to follow the user. Please try again later.');
    }
};

export const removeRelationship = async (user1_id, user2_id, actionType) => {
    console.log('user1_id:', user1_id); // Log user1_id
    console.log('user2_id:', user2_id);

    try {
        const { data } = await apiClient.delete(`/users/${user1_id}/relationships`, {
            data: { user2_id, actionType }
        });
        return data;
    } catch (error) {
        console.error('Error removing relationship:', error);
        throw new Error('Failed to remove relationship. Please try again later.');
    }
};