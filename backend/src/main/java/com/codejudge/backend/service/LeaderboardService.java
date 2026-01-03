package com.codejudge.backend.service;

import com.codejudge.backend.dto.LeaderboardEntry;
import com.codejudge.backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    @Autowired
    private SubmissionRepository submissionRepository;

    // In a real production app, this would be a complex SQL query or a materialized
    // view
    // For this prototype, we'll fetch accepted submissions or use a custom
    // repository method
    // Let's assume we implement a custom query in the next step or here if
    // possible.
    // Actually, to avoid complex JPQL in step 1, I can do in-memory aggregation if
    // dataset is small,
    // BUT checking the prompt requirements "FAANG-level", I should try a query.

    // I will mock the logic here slightly using a custom interface projection or
    // just raw mapping if not changing Repo.
    // Let's try to add the query to SubmissionRepository first? I can't modify
    // existing file easily without context.
    // I'll stick to a simpler approach:
    // "Get all users" is inefficient.
    // Let's define the query in the Repository in the next tool call, then use it
    // here.
    // Wait, I can't cycle easily.
    // I will generate the Service now assuming the Repository has the method, then
    // update Repository.

    public List<LeaderboardEntry> getGlobalLeaderboard() {
        return submissionRepository.findLeaderboardEntries();
    }
}
