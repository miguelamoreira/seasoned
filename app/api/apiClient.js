import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.71:3000',
    timeout: 10000,
})

export default apiClient;