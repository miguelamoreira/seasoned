import apiClient from './apiClient'

export const fetchNotificationsConfigurations = async (id) => {
    try {
        const { data } = await apiClient.get(`/notifications/configurations/${id}`);
        return data;
    } catch (error) {
        console.error('Error when fetching notifications configurations: ', error);
        throw new Error('Failed to fetch notifications configurations.')
    }
}

export const updateNotificationsConfigurations = async (id, settings) => {
    try {
        const { data } = await apiClient.patch(`/notifications/configurations/${id}`, settings);
        return data;
    } catch (error) {
        console.error('Error when updating notifications configurations:', error);
        throw new Error('Failed to update notifications configurations.');
    }
};

export const fetchNotifications = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/notifications`);
        return data;
    } catch (error) {
        console.error('Error when fetching notifications: ', error);
        throw new Error('Failed to fetch notifications.')
    }
}