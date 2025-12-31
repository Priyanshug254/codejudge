package com.codejudge.backend.repository;

import com.codejudge.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(Long userId);

    List<Submission> findByProblemId(Long problemId);

    @org.springframework.data.jpa.repository.Query("SELECT new com.codejudge.backend.dto.LeaderboardEntry(u.id, u.username, SUM(s.score), COUNT(DISTINCT s.problem.id)) "
            +
            "FROM Submission s " +
            "JOIN s.user u " +
            "WHERE s.verdict = 'ACCEPTED' " +
            "GROUP BY u.id, u.username " +
            "ORDER BY SUM(s.score) DESC")
    List<com.codejudge.backend.dto.LeaderboardEntry> findLeaderboardEntries();
}
