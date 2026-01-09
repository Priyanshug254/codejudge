package com.codejudge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionDetailDTO {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String language;
    private String code;
    private String verdict;
    private Integer score;
    private Integer executionTimeMs;
    private Integer memoryUsedKb;
    private LocalDateTime submittedAt;

    // Output/Error if we store it? The Entity doesn't seem to store output
    // persistently
    // unless I missed it. I saw executeResponse returning it, but Submission entity
    // has status/verdict.
    // Let's assume we don't store full output log in DB for now to save space, or
    // maybe passing it if available.
}
