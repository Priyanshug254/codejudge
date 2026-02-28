package com.codejudge.backend.repository;

import com.codejudge.backend.model.Scratchpad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScratchpadRepository extends JpaRepository<Scratchpad, Long> {
    Optional<Scratchpad> findByProblemIdAndUsername(Long problemId, String username);
}
