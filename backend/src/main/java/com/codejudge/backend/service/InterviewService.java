package com.codejudge.backend.service;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class InterviewService {

    private final List<String> fallbackPrompts = Arrays.asList(
            "Could you explain the time complexity of your current approach?",
            "How would this scale if the input size was 10^9?",
            "Are there any edge cases you've considered?",
            "Can we optimize the space complexity further?",
            "What happens if there are duplicate values in the input?");

    public String generateQuestion(String code, String problemDescription, String language) {
        // In a real production app, this would call Gemini or OpenAI API
        // structured to analyze the code and ask a specific, challenging question.

        // Mocking contextual intelligence:
        if (code.contains("HashMap") || code.contains("Dict")) {
            return "I see you're using a hash-based structure. Can you discuss the worst-case scenario for lookups if we have many collisions?";
        }

        if (code.contains("sort") || code.contains("sorted")) {
            return "Using a sorting approach gives us O(N log N). Is there a way to solve this in linear time perhaps using supplementary space?";
        }

        if (code.contains("recursive") || code.contains("def") && code.contains("(")) {
            // Very basic recursion check
            return "How would you refactor this recursive solution to an iterative one to avoid stack overflow for very deep inputs?";
        }

        // Return a random sophisticated-sounding question
        return fallbackPrompts.get(new Random().nextInt(fallbackPrompts.length));
    }
}
