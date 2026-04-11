package com.resumeanalyzer.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.resumeanalyzer.backend.model.JobRole;
import com.resumeanalyzer.backend.service.JobRoleService;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobRoleController {

    @Autowired
    private JobRoleService jobRoleService;

    @GetMapping("/roles")
    public ResponseEntity<List<JobRole>> getAllJobRoles() {
        return ResponseEntity.ok(jobRoleService.getAllJobRoles());
    }

    @PostMapping("/roles")
    public ResponseEntity<JobRole> createJobRole(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String requiredSkills = request.get("requiredSkills");
        return ResponseEntity.ok(jobRoleService.createJobRole(title, requiredSkills));
    }
}