import apiClient from './apiClient'

export const fetchLikedReviews = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/likes/reviews`);
        return data.data;
    } catch (error) {
        console.error('Error fetching liked reviews: ', error);
        throw new Error('Failed to fetch liked reviews. Please try again later.');
    }
}

export const likeReview = async (userId, reviewId) => {
    try {
        const response = await apiClient.post(`/users/${userId}/likes/reviews`, { reviewId });
        return response.data;
    } catch (error) {
        console.error('Error liking the review: ', error);
        throw new Error('Failed to like the review. Please try again later.');
    }
}

export const dislikeReview = async (userId, reviewId) => {
    try {
        const response = await apiClient.delete(`/users/${userId}/likes/reviews`, { reviewId });
        return response.data;
    } catch (error) {
        console.error('Error liking the review: ', error);
        throw new Error('Failed to like the review. Please try again later.');
    }
}