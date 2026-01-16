package com.codejudge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExecuteResponse {
    private String output;
    private String error;
    private long executionTimeMs;
    private boolean isTimeout;
    private int exitCode;
}
