import api from './api';
import { Problem, ProblemRequest } from '../types/problem';

class ProblemService {
    getAllProblems() {
        return api.get<Problem[]>('/problems');
    }

    getProblemById(id: string) {
        return api.get<Problem>(`/problems/${id}`);
    }

    createProblem(problem: ProblemRequest) {
        return api.post<Problem>('/problems', problem);
    }
}

export default new ProblemService();
