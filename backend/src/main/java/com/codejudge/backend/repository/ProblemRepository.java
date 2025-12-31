package com.codejudge.backend.repository;

import com.codejudge.backend.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // Add custom queries if needed
}
