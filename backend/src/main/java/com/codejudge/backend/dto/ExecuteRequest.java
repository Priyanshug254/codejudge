package com.codejudge.backend.dto;

import lombok.Data;

@Data
public class ExecuteRequest {
    private String code;
    private String language;
    private Long problemId;
}
