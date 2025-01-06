import apiClient from './apiClient'

export const fetchRatingsGroupedByScore = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/ratings`);
        return data.data;
    } catch (error) {
        console.error('Error fetching ratings grouped by score: ', error);
        throw new Error('Failed to fetch ratings grouped by score. Please try again later.');
    }
}

export const fetchReviews = async () => {
    try {
        const { data } = await apiClient.get('/reviews');
        return data.data;
    } catch (error) {
        console.error('Error fetching reviews: ', error);
        throw new Error('Failed to fetch reviews. Please try again later.');
    }
};

export const fetchReviewById = async (reviewId) => {
    try {
        const { data } = await apiClient.get(`/reviews/${reviewId}`);
        return data.data;
    } catch (error) {
        console.error('Error fetching review by ID: ', error);
        throw new Error('Failed to fetch review. Please try again later.');
    }
};

export const fetchReviewsByUserId = async (userId) => {
    try {
        const { data } = await apiClient.get(`/users/${userId}/reviews`);
        return data.data;
    } catch (error) {
        console.error('Error fetching reviews by user ID: ', error);
        throw new Error('Failed to fetch reviews. Please try again later.');
    }
};

export const fetchReviewsBySeriesId = async (seriesId) => {
    try {
        const { data } = await apiClient.get(`/series/${seriesId}/reviews`);
        return data.data;
    } catch (error) {
        console.error('Error fetching reviews by series ID: ', error);
        throw new Error('Failed to fetch reviews. Please try again later.');
    }
};

export const fetchReviewsByEpisodeId = async (episodeId) => {
    try {
        const { data } = await apiClient.get(`/episodes/${episodeId}/reviews`);
        return data.data;
    } catch (error) {
        console.error('Error fetching reviews by episode ID: ', error);
        throw new Error('Failed to fetch reviews. Please try again later.');
    }
};

export const createReviews = async (userId, reviews) => {
    try {
        const { data } = await apiClient.post('/reviews', {
            user_id: userId,
            reviews: reviews
        });
        return data.data;
    } catch (error) {
        console.error('Error creating reviews: ', error);
        throw new Error('Failed to create reviews. Please try again later.');
    }
};