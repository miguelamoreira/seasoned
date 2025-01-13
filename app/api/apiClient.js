import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.55:3000',
    //baseURL: 'http://172.23.113.13:3000',
    //baseURL: 'http://192.168.1.31:3000',
    timeout: 10000,
})

export default apiClient;