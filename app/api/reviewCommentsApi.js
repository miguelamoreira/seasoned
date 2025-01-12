import apiClient from './apiClient'

export const addCommentToReview = async (reviewId, userId, comment) => {
    try {
        const { data } = await apiClient.post(`/reviews/${reviewId}/comments`, {
            userId,
            comment,
        });
        return data;
    } catch (error) {
        console.error('Error adding comment to review: ', error);
        throw new Error('Failed to add comment to the review. Please try again later.');
    }
};