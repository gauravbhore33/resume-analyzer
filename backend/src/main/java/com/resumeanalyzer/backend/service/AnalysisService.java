package com.resumeanalyzer.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeanalyzer.backend.model.AnalysisResult;
import com.resumeanalyzer.backend.model.JobRole;
import com.resumeanalyzer.backend.model.Resume;
import com.resumeanalyzer.backend.repository.AnalysisResultRepository;
import com.resumeanalyzer.backend.repository.JobRoleRepository;
import com.resumeanalyzer.backend.repository.ResumeRepository;

@Service
public class AnalysisService {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private JobRoleRepository jobRoleRepository;

    @Autowired
    private AnalysisResultRepository analysisResultRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnalysisResult analyzeResume(Long resumeId, Long jobRoleId) throws Exception {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        JobRole jobRole = jobRoleRepository.findById(jobRoleId)
                .orElseThrow(() -> new RuntimeException("Job Role not found"));

        String aiResponse = geminiService.analyzeResume(
                resume.getExtractedText(),
                jobRole.getTitle(),
                jobRole.getRequiredSkills()
        );

        JsonNode json = objectMapper.readTree(aiResponse);

        AnalysisResult result = new AnalysisResult();
        result.setResume(resume);
        result.setJobRole(jobRole);
        result.setAtsScore(json.path("ats_score").asInt());
        result.setMatchedSkills(json.path("matched_skills").asText());
        result.setMissingSkills(json.path("missing_skills").asText());
        result.setSuggestions(json.path("suggestions").asText());

        return analysisResultRepository.save(result);
    }

    public List<AnalysisResult> getResultsByResume(Long resumeId) {
        return analysisResultRepository.findByResumeId(resumeId);
    }

    public AnalysisResult getResultById(Long id) {
        return analysisResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis result not found"));
    }

    public List<AnalysisResult> getLeaderboardByJobRole(Long jobRoleId) {
        return analysisResultRepository.findByJobRoleId(jobRoleId);
    }
}