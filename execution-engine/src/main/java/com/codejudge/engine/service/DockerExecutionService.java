package com.codejudge.engine.service;

import com.codejudge.engine.dto.ExecuteRequest;
import com.codejudge.engine.dto.ExecuteResponse;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class DockerExecutionService {

    private static final String TEMP_DIR = System.getProperty("java.io.tmpdir") + File.separator + "codejudge";

    public DockerExecutionService() {
        new File(TEMP_DIR).mkdirs();
    }

    public ExecuteResponse execute(ExecuteRequest request) {
        String runId = UUID.randomUUID().toString();
        Path runDir = Path.of(TEMP_DIR, runId);

        try {
            Files.createDirectories(runDir);

            // 1. Write Code and Input to files
            String filename = getFilename(request.getLanguage());
            Files.writeString(runDir.resolve(filename), request.getCode());

            if (request.getInput() != null) {
                Files.writeString(runDir.resolve("input.txt"), request.getInput());
            } else {
                Files.writeString(runDir.resolve("input.txt"), "");
            }

            // 2. Build Docker Command
            List<String> command = new ArrayList<>();
            command.add("docker");
            command.add("run");
            command.add("--rm");
            command.add("--network");
            command.add("none");
            command.add("--memory");
            command.add("128m");
            command.add("--cpus");
            command.add("0.5");
            command.add("-v");
            command.add(runDir.toAbsolutePath() + ":/app");
            // Set input redirection inside the container logic isn't easily done with
            // flags,
            // so we use shell form in image or command.
            // Simplified: We assume image ENTRYPOINT handles it or we wrap in shell.
            // For now, let's use a shell wrapper approach in the command for robustness.

            String image = getImage(request.getLanguage());
            command.add(image);

            // Override CMD to redirect input
            // python3 solution.py < input.txt
            String cmdInContainer = getRunCommand(request.getLanguage());
            command.add("sh");
            command.add("-c");
            command.add(cmdInContainer + " < input.txt");

            ProcessBuilder pb = new ProcessBuilder(command);
            long startTime = System.currentTimeMillis();
            Process process = pb.start();

            // 3. Wait for completion with timeout
            boolean finished = process.waitFor(request.getTimeLimitMs() + 500, TimeUnit.MILLISECONDS); // slightly
                                                                                                       // buffered

            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;

            if (!finished) {
                process.destroyForcibly();
                return ExecuteResponse.builder()
                        .isTimeout(true)
                        .executionTimeMs(request.getTimeLimitMs())
                        .build();
            }

            // 4. Capture Output
            String output = new String(process.getInputStream().readAllBytes());
            String error = new String(process.getErrorStream().readAllBytes());

            return ExecuteResponse.builder()
                    .output(output.trim())
                    .error(error.trim())
                    .exitCode(process.exitValue())
                    .executionTimeMs(duration)
                    .isTimeout(false)
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return ExecuteResponse.builder().error("Internal Error: " + e.getMessage()).build();
        } finally {
            // Cleanup
            deleteDirectory(runDir.toFile());
        }
    }

    private String getFilename(String lang) {
        switch (lang.toLowerCase()) {
            case "python":
                return "solution.py";
            case "java":
                return "Solution.java";
            case "cpp":
                return "solution.cpp";
            default:
                throw new IllegalArgumentException("Unsupported language");
        }
    }

    private String getImage(String lang) {
        switch (lang.toLowerCase()) {
            case "python":
                return "python:3.9-slim"; // using direct image for now, normally custom 'codejudge-python'
            case "java":
                return "openjdk:17-slim";
            case "cpp":
                return "gcc:latest";
            default:
                throw new IllegalArgumentException("Unsupported language");
        }
    }

    private String getRunCommand(String lang) {
        switch (lang.toLowerCase()) {
            case "python":
                return "python3 solution.py";
            case "java":
                return "javac Solution.java && java Solution";
            case "cpp":
                return "g++ -o solution solution.cpp && ./solution";
            default:
                throw new IllegalArgumentException("Unsupported language");
        }
    }

    private void deleteDirectory(File file) {
        File[] contents = file.listFiles();
        if (contents != null) {
            for (File f : contents) {
                deleteDirectory(f);
            }
        }
        file.delete();
    }
}
