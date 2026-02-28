package com.codejudge.backend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AIService {

    public Map<String, Object> analyzeCode(String code, String problemDescription, String language) {
        // Mocking a sophisticated LLM analysis
        Map<String, Object> response = new HashMap<>();
        response.put("summary", "Analysis complete. Found 3 key areas for improvement.");

        List<Map<String, Object>> issues = new ArrayList<>();

        // Logical Issue
        if (!code.contains("if") && problemDescription.toLowerCase().contains("conditional")) {
            issues.add(createIssue("logic-1", "critical", "quality", "Missing conditional logic",
                    "The problem requires handling specific conditions which are currently missing.",
                    "Add an if-statement to handle the boundary cases."));
        }

        // Performance Issue
        if (code.contains("for") && code.split("for").length > 2) {
            issues.add(createIssue("perf-1", "warning", "performance", "Potential O(N^2) Complexity",
                    "Nested loops detected which may exceed time limits for large inputs.",
                    "Consider using a data structure like a HashMap to reduce lookup time to O(1)."));
        }

        // Best Practice
        if (code.contains("System.out.println") || code.contains("print(")) {
            issues.add(createIssue("bp-1", "info", "best-practice", "Stray Debug Statements",
                    "Production code should typically avoid direct console printing.",
                    "Remove print statements or use a logger."));
        }

        // Security (Simulated)
        if (code.contains("eval(") || code.contains("exec(")) {
            issues.add(createIssue("sec-1", "critical", "security", "Dangerous Function Usage",
                    "Use of eval() or exec() can lead to arbitrary code execution vulnerabilities.",
                    "Parse inputs strictly and avoid dynamic execution."));
        }

        response.put("issues", issues);
        response.put("complexityScore", calculateComplexity(code));

        return response;
    }

    private Map<String, Object> createIssue(String id, String severity, String category, String title,
            String description, String suggestion) {
        Map<String, Object> issue = new HashMap<>();
        issue.put("id", id);
        issue.put("severity", severity);
        issue.put("category", category);
        issue.put("title", title);
        issue.put("description", description);
        issue.put("suggestion", suggestion);
        return issue;
    }

    private int calculateComplexity(String code) {
        int score = 10;
        if (code.contains("for"))
            score += 20;
        if (code.contains("while"))
            score += 20;
        if (code.contains("if"))
            score += 10;
        return Math.min(score + (code.length() / 100), 100);
    }
}
