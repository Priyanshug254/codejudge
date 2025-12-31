package com.codejudge.backend.repository;

import com.codejudge.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(Long userId);

    List<Submission> findByProblemId(Long problemId);
}
