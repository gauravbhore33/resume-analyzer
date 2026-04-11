package com.resumeanalyzer.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.resumeanalyzer.backend.model.JobRole;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
}