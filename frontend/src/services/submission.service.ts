import api from './api';
import { ExecuteRequest, SubmissionResponse } from '../types/submission';

class SubmissionService {
    runCode(data: ExecuteRequest) {
        // This endpoint needs to be created in backend to proxy to engine or handle "run" logic
        // For now we will assume POST /submissions/run exists or similar
        // Actually, per plan, Backend -> Execution Engine.
        return api.post<SubmissionResponse>('/submissions/run', data);
    }

    submitCode(data: ExecuteRequest) {
        return api.post<SubmissionResponse>('/execute/submit', data);
    }

    getSubmission(id: string) {
        return api.get(`/submissions/${id}`);
    }
}

export default new SubmissionService();
