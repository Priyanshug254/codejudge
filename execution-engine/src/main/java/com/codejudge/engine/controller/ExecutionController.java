package com.codejudge.engine.controller;

import com.codejudge.engine.dto.ExecuteRequest;
import com.codejudge.engine.dto.ExecuteResponse;
import com.codejudge.engine.service.DockerExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
public class ExecutionController {

    @Autowired
    private DockerExecutionService executionService;

    @PostMapping
    public ResponseEntity<ExecuteResponse> execute(@RequestBody ExecuteRequest request) {
        return ResponseEntity.ok(executionService.execute(request));
    }
}
