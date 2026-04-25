package com.resumeanalyzer.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.resumeanalyzer.backend.model.AnalysisResult;
import com.resumeanalyzer.backend.service.AnalysisService;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestBody Map<String, Long> request) {
        try {
            Long resumeId = request.get("resumeId");
            Long jobRoleId = request.get("jobRoleId");
            AnalysisResult result = analysisService.analyzeResume(resumeId, jobRoleId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Analysis failed: " + e.getMessage());
        }
    }

    @GetMapping("/results/{resumeId}")
    public ResponseEntity<List<AnalysisResult>> getResults(@PathVariable Long resumeId) {
        return ResponseEntity.ok(analysisService.getResultsByResume(resumeId));
    }

    @GetMapping("/result/{id}")
    public ResponseEntity<AnalysisResult> getResultById(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getResultById(id));
    }

    @GetMapping("/leaderboard/{jobRoleId}")
    public ResponseEntity<List<AnalysisResult>> getLeaderboard(@PathVariable Long jobRoleId) {
        return ResponseEntity.ok(analysisService.getLeaderboardByJobRole(jobRoleId));
    }
}