package com.codejudge.backend.controller;

import com.codejudge.backend.dto.MessageResponse;
import com.codejudge.backend.dto.ProblemRequest;
import com.codejudge.backend.model.Problem;
import com.codejudge.backend.security.services.UserDetailsImpl;
import com.codejudge.backend.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private ProblemService problemService;

    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('EXAMINER') or hasRole('ADMIN')")
    public ResponseEntity<?> createProblem(@RequestBody ProblemRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Problem problem = problemService.createProblem(request, userDetails.getId());
        return ResponseEntity.ok(problem);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EXAMINER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.ok(new MessageResponse("Problem deleted successfully!"));
    }
}
