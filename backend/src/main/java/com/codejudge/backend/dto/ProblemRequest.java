package com.codejudge.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProblemRequest {
    private String title;
    private String slug;
    private String description;
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private List<TestCaseRequest> testCases;

    @Data
    public static class TestCaseRequest {
        private String input;
        private String expectedOutput;
        private Boolean isHidden;
        private Integer weightage;
    }
}
