import api from './api';

interface Stats {
    totalUsers: number;
    totalProblems: number;
    totalSubmissions: number;
}

class AdminService {
    getStats() {
        return api.get<Stats>('/admin/stats');
    }
}

export default new AdminService();
