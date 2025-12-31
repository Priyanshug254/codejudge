package com.codejudge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardEntry {
    private Long userId;
    private String username;
    private Long totalScore;
    private Integer problemsSolved;
}
