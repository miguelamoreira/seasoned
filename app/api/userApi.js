import apiClient from './apiClient'

export const findUserById = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}`);
        return data.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user. Please try again later.');
    }
}

export const updateUsername = async (id, name) => {
    try {
        const { data } = await apiClient.patch(`/users/${id}/username`, { name });
        return data;
    } catch (error) {
        console.error('Error updating username:', error);
        throw new Error('Failed to update username. Please try again later.');
    }
};

export const updateUserData = async (id, email, currentPassword, newPassword, confirmNewPassword) => {
    try {
        const { data } = await apiClient.patch(`/users/${id}`, {
            email,
            currentPassword,
            newPassword,
            confirmNewPassword,
        });
        return data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw new Error('Failed to update user data. Please try again later.');
    }
};

export const updateUserAvatar = async (id, avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
        const { data } = await apiClient.patch(`/users/${id}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } catch (error) {
        console.error('Error updating avatar:', error);
        throw new Error('Failed to update avatar. Please try again later.');
    }
};

export const deleteUserAvatar = async (id) => {
    try {
        const { data } = await apiClient.delete(`/users/${id}/avatar`);
        return data;
    } catch (error) {
        console.error('Error deleting avatar:', error);
        throw new Error('Failed to delete avatar. Please try again later.');
    }
}

export const deleteUserById = async (id) => {
    try {
        const { data } = await apiClient.delete(`/users/${id}`);
        return data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user. Please try again later.');
    }
}

export const findAllUsers = async (searchText) => {
    try {
        const response = await apiClient.get(`/users/`, {
            params: { query: searchText }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users. Please try again later.');
    }
};


export const updateUserTimeWatched = async (id, total_time_spent) => {
    try {
        const { data } = await apiClient.patch(`/users/${id}/time`, {
            total_time_spent
        });
        return data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw new Error('Failed to update user data. Please try again later.');
    }
};

export const fetchContinueWatching = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/continueWatching`);
        return data.data;
    } catch (error) {
        console.error('Error fetching continue watching:', error);
        throw new Error('Failed to fetch continue watching. Please try again later.');
    }
}