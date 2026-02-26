package com.codejudge.backend.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

@Service
public class AIService {

    public Map<String, Object> analyzeCode(String code, String problemDescription, String language) {
        // In a real production app, this would call Gemini or OpenAI API
        // For this implementation, we simulate a sophisticated AI response
        // that goes beyond simple structural analysis.

        Map<String, Object> response = new HashMap<>();
        response.put("summary", "Your code implements the basic logic but has potential performance bottlenecks.");

        Map<String, String> analysis = new HashMap<>();
        analysis.put("Time Complexity", "O(n^2) due to nested loops. Consider using a HashMap for O(n).");
        analysis.put("Memory Usage", "O(n) - within acceptable limits.");
        analysis.put("Best Practice", "Use more descriptive variable names for clarity.");

        response.put("detailedAnalysis", analysis);
        response.put("suggestion", "Try replacing the inner loop with a frequency map look-up.");

        return response;
    }
}
