package com.codejudge.backend.controller;

import com.codejudge.backend.dto.SubmissionDetailDTO;
import com.codejudge.backend.model.Submission;
import com.codejudge.backend.repository.SubmissionRepository;
import com.codejudge.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Submission submission = submissionRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Security check: only owner or admin can view
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_EXAMINER"));

        if (!submission.getUser().getId().equals(userDetails.getId()) && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to view this submission");
        }

        SubmissionDetailDTO dto = SubmissionDetailDTO.builder()
                .id(submission.getId())
                .problemId(submission.getProblem().getId())
                .problemTitle(submission.getProblem().getTitle())
                .language(submission.getLanguage())
                .code(submission.getCode())
                .verdict(submission.getVerdict())
                .score(submission.getScore())
                .executionTimeMs(submission.getExecutionTimeMs())
                .memoryUsedKb(submission.getMemoryUsedKb())
                .submittedAt(submission.getSubmittedAt())
                .build();

        return ResponseEntity.ok(dto);
    }
}
