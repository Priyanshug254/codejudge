export interface Problem {
    id: number;
    title: string;
    slug: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    timeLimitMs: number;
    memoryLimitMb: number;
    isActive: boolean;
}

export interface TestCaseRequest {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    weightage: number;
}

export interface ProblemRequest {
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    timeLimitMs: number;
    memoryLimitMb: number;
    testCases: TestCaseRequest[];
}
