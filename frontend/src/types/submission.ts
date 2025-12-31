export interface SubmissionResponse {
    output: string;
    error: string;
    executionTimeMs: number;
    isTimeout: boolean;
    exitCode: number;
}

export interface ExecuteRequest {
    code: string;
    language: string;
    problemId: number;
}
