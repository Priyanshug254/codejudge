import api from './api';
import { AuthResponse } from '../types/auth';

class AuthService {
    login(username: string, password: string) {
        return api
            .post<AuthResponse>('/auth/signin', {
                username,
                password,
            })
            .then((response) => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    register(username: string, email: string, password: string, fullName: string) {
        return api.post('/auth/signup', {
            username,
            email,
            password,
            fullName
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
}

export default new AuthService();
