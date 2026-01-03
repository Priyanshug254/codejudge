package com.codejudge.backend.controller;

import com.codejudge.backend.dto.UserProfileResponse;
import com.codejudge.backend.model.Submission;
import com.codejudge.backend.model.User;
import com.codejudge.backend.repository.SubmissionRepository;
import com.codejudge.backend.repository.UserRepository;
import com.codejudge.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private SubmissionRepository submissionRepository;

        @GetMapping("/me")
        public ResponseEntity<?> getCurrentUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
                User user = userRepository.findById(userDetails.getId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                long solvedCount = submissionRepository.countByUserIdAndVerdict(user.getId(), "ACCEPTED");
                List<Submission> recentSubmissions = submissionRepository.findByUserId(user.getId());

                // Limit to last 10
                List<UserProfileResponse.SubmissionSummary> recent = recentSubmissions.stream()
                                .sorted((a, b) -> b.getId().compareTo(a.getId())) // assuming higher ID is newer
                                .limit(10)
                                .map(s -> UserProfileResponse.SubmissionSummary.builder()
                                                .id(s.getId())
                                                .problemTitle(s.getProblem().getTitle())
                                                .verdict(s.getVerdict())
                                                .score(Long.valueOf(s.getScore() != null ? s.getScore() : 0))
                                                .language(s.getLanguage())
                                                .createdAt(s.getId().toString())
                                                .build())
                                .collect(Collectors.toList());

                List<String> roles = user.getRole() != null ? List.of(user.getRole().getName()) : List.of();

                return ResponseEntity.ok(UserProfileResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .roles(roles)
                                .problemsSolved(solvedCount)
                                .recentSubmissions(recent)
                                .build());
        }
}
