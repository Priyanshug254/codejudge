package com.codejudge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private List<String> roles;
    private Long problemsSolved;
    private List<SubmissionSummary> recentSubmissions;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubmissionSummary {
        private Long id;
        private String problemTitle;
        private String verdict;
        private Long score;
        private String language;
        private String createdAt; // simplified date string
    }
}
