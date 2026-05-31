import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true
});

// Надежный перехватчик для всех версий Axios
instance.interceptors.request.use((config) => {
    const email = localStorage.getItem('email');
    if (email) {
        if (config.headers.set) {
            config.headers.set('User-Email', email);
        } else {
            config.headers['User-Email'] = email;
        }
    }
    return config;
});

export default instance;