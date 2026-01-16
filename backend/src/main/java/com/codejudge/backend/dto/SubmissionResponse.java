package com.codejudge.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionResponse {
    private Long id;
    private String verdict;
    private String output;
    private String error;
}
