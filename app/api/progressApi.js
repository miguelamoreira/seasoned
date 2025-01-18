import apiClient from './apiClient'

export const getSeriesProgress = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/seriesProgress`);
        
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user. Please try again later.');
    }
}



export const getSeasonProgress = async (id) => {
    try {
        const { data } = await apiClient.get(`/users/${id}/seasonProgress`);
        
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user. Please try again later.');
    }
}


export const postSeasonProgress = async (id, body)=>{
    
    try {
        const { data } = await apiClient.post(`/users/${id}/seasonProgress`,   body );
        return data;
    } catch (error) {
        console.error('Error adding seasonProgress:', error);
        throw new Error('Failed to add new seasonProgress. Please try again later.');
    }
}

export const postSeriesProgress = async (id, body)=>{
    
    try {
        const { data } = await apiClient.post(`/users/${id}/seriesProgress`,   body );
        return data;
    } catch (error) {
        console.error('Error adding seriesProgress:', error);
        throw new Error('Failed to add new seriesProgress. Please try again later.');
    }
}