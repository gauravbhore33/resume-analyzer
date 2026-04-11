package com.resumeanalyzer.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resumeanalyzer.backend.model.JobRole;
import com.resumeanalyzer.backend.repository.JobRoleRepository;

@Service
public class JobRoleService {

    @Autowired
    private JobRoleRepository jobRoleRepository;

    public List<JobRole> getAllJobRoles() {
        return jobRoleRepository.findAll();
    }

    public JobRole createJobRole(String title, String requiredSkills) {
        JobRole jobRole = new JobRole();
        jobRole.setTitle(title);
        jobRole.setRequiredSkills(requiredSkills);
        return jobRoleRepository.save(jobRole);
    }

    public JobRole getJobRoleById(Long id) {
        return jobRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Role not found"));
    }
}