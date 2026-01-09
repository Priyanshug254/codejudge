import api from './api';
import { Problem, ProblemRequest } from '../types/problem';

class ProblemService {
    getAllProblems() {
        return api.get<Problem[]>('/problems');
    }

    getProblemById(id: string) {
        return api.get<Problem>(`/problems/${id}`);
    }

    createProblem(data: ProblemRequest) {
        return api.post<Problem>('/problems', data);
    }

    deleteProblem(id: number) {
        return api.delete(`/problems/${id}`);
    }
}

export default new ProblemService();
