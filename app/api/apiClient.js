import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://192.168.115.212:3000',
    //baseURL: 'http://192.168.1.31:3000',
    timeout: 10000,
})

export default apiClient;