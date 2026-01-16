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
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import com.codejudge.backend.dto.ExecuteRequest;
import com.codejudge.backend.dto.ExecuteResponse;
import com.codejudge.backend.dto.SubmissionResponse;
import com.codejudge.backend.repository.ProblemRepository;
import com.codejudge.backend.repository.UserRepository;
import com.codejudge.backend.model.Problem;
import com.codejudge.backend.model.User;
import java.time.LocalDateTime;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

        @Autowired
        private SubmissionRepository submissionRepository;

        @Autowired
        private ProblemRepository problemRepository;

        @Autowired
        private UserRepository userRepository;

        @GetMapping("/{id}")
        public ResponseEntity<?> getSubmissionById(@PathVariable Long id,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
                Submission submission = submissionRepository.findById(Objects.requireNonNull(id))
                                .orElseThrow(() -> new RuntimeException("Submission not found"));

                // Security check: only owner or admin can view
                boolean isAdmin = userDetails.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                                                || a.getAuthority().equals("ROLE_EXAMINER"));

                if (!submission.getUser().getId().equals(userDetails.getId()) && !isAdmin) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body("You are not authorized to view this submission");
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

        @PostMapping("/execute/submit")
        public ResponseEntity<?> submitCode(@RequestBody ExecuteRequest request,
                        @AuthenticationPrincipal UserDetailsImpl userDetails) {

                User user = userRepository.findById(userDetails.getId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Problem problem = problemRepository.findById(request.getProblemId())
                                .orElseThrow(() -> new RuntimeException("Problem not found"));

                // Call Execution Engine
                RestTemplate restTemplate = new RestTemplate();
                // Assuming engine is running on localhost:8081
                String engineUrl = "http://localhost:8081/execute";

                java.util.Map<String, Object> enginePayload = new java.util.HashMap<>();
                enginePayload.put("code", request.getCode());
                enginePayload.put("language", request.getLanguage());
                enginePayload.put("input", "");
                enginePayload.put("timeLimitMs", problem.getTimeLimitMs());

                String output = "";
                String error = "";
                String verdict = "WRONG_ANSWER";

                try {
                        ExecuteResponse engineRes = restTemplate.postForObject(engineUrl, enginePayload,
                                        ExecuteResponse.class);
                        if (engineRes != null) {
                                output = engineRes.getOutput();
                                error = engineRes.getError();

                                // Demo Logic: If no error, accept.
                                if (error == null || error.isEmpty()) {
                                        verdict = "ACCEPTED";
                                } else {
                                        verdict = "RUNTIME_ERROR";
                                }
                        }
                } catch (Exception e) {
                        error = "Execution Engine Error: " + e.getMessage();
                        verdict = "INTERNAL_ERROR";
                }

                // Save Submission
                Submission submission = new Submission();
                submission.setUser(user);
                submission.setProblem(problem);
                submission.setCode(request.getCode());
                submission.setLanguage(request.getLanguage());
                submission.setVerdict(verdict);
                submission.setScore(verdict.equals("ACCEPTED") ? 100 : 0);
                submission.setExecutionTimeMs(0); // Mock
                submission.setMemoryUsedKb(0); // Mock
                submission.setSubmittedAt(LocalDateTime.now());

                Submission saved = submissionRepository.save(submission);

                return ResponseEntity.ok(SubmissionResponse.builder()
                                .id(saved.getId())
                                .verdict(saved.getVerdict())
                                .output(output + (error != null && !error.isEmpty() ? "\nError: " + error : ""))
                                .build());
        }
}
