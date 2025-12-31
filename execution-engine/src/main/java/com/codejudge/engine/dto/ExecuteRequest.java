package com.codejudge.engine.dto;

import lombok.Data;

@Data
public class ExecuteRequest {
    private String code;
    private String language; // python, java, cpp
    private String input;
    private long timeLimitMs;
}
