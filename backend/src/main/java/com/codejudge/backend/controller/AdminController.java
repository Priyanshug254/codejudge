package com.codejudge.backend.controller;

import com.codejudge.backend.dto.AdminStatsResponse;
import com.codejudge.backend.repository.ProblemRepository;
import com.codejudge.backend.repository.SubmissionRepository;
import com.codejudge.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemStats() {
        long userCount = userRepository.count();
        long problemCount = problemRepository.count();
        long submissionCount = submissionRepository.count();

        return ResponseEntity.ok(AdminStatsResponse.builder()
                .totalUsers(userCount)
                .totalProblems(problemCount)
                .totalSubmissions(submissionCount)
                .build());
    }
}
