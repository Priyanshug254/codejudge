package com.codejudge.backend.controller;

import com.codejudge.backend.model.Scratchpad;
import com.codejudge.backend.repository.ScratchpadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/scratchpads")
public class ScratchpadController {

    @Autowired
    private ScratchpadRepository scratchpadRepository;

    @GetMapping("/{problemId}/{username}")
    public ResponseEntity<?> getScratchpad(@PathVariable Long problemId, @PathVariable String username) {
        return scratchpadRepository.findByProblemIdAndUsername(problemId, username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveScratchpad(@RequestBody Map<String, Object> request) {
        Long problemId = Long.valueOf(request.get("problemId").toString());
        String username = request.get("username").toString();
        String canvasData = request.get("canvasData").toString();

        Scratchpad scratchpad = scratchpadRepository.findByProblemIdAndUsername(problemId, username)
                .orElse(new Scratchpad());

        scratchpad.setProblemId(problemId);
        scratchpad.setUsername(username);
        scratchpad.setCanvasData(canvasData);

        scratchpadRepository.save(scratchpad);
        return ResponseEntity.ok(Map.of("message", "Scratchpad saved successfully"));
    }
}
