package com.resumeanalyzer.backend.service;

import java.io.IOException;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.resumeanalyzer.backend.model.Resume;
import com.resumeanalyzer.backend.model.User;
import com.resumeanalyzer.backend.repository.ResumeRepository;
import com.resumeanalyzer.backend.repository.UserRepository;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    public Resume uploadResume(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String extractedText = extractTextFromPDF(file);

        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFilePath(file.getOriginalFilename());
        resume.setExtractedText(extractedText);

        return resumeRepository.save(resume);
    }

    private String extractTextFromPDF(MultipartFile file) throws IOException {
    try (PDDocument document = Loader.loadPDF(file.getBytes())) {
        PDFTextStripper stripper = new PDFTextStripper();
        return stripper.getText(document);
    }
}

    public List<Resume> getResumesByUser(Long userId) {
        return resumeRepository.findByUserId(userId);
    }
}