package com.codejudge.backend.controller;

import com.codejudge.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String problemDescription = request.get("problemDescription");
        String language = request.get("language");

        return ResponseEntity.ok(aiService.analyzeCode(code, problemDescription, language));
    }
}
