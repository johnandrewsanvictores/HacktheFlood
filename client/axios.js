import axios from 'axios';

const getBaseURL = () => {
    const envURL = import.meta.env.VITE_API_URL;
    if (envURL) {
        if (envURL.startsWith('http://') || envURL.startsWith('https://')) {
            return envURL;
        }
        return `http://${envURL}`;
    }
    return 'http://localhost:3000';
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;