package com.resumeanalyzer.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String analyzeResume(String resumeText, String jobTitle, String requiredSkills) {
        try {
            String prompt = buildPrompt(resumeText, jobTitle, requiredSkills);
            String requestBody = buildRequestBody(prompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request, HttpResponse.BodyHandlers.ofString());

            System.out.println("=== GROQ RAW RESPONSE ===");
            System.out.println(response.body());
            System.out.println("=== END RESPONSE ===");

            return extractTextFromResponse(response.body());

        } catch (Exception e) {
            throw new RuntimeException("Failed to call Groq API: " + e.getMessage());
        }
    }

    private String buildPrompt(String resumeText, String jobTitle, String requiredSkills) {
        String limitedText = resumeText.length() > 2000
                ? resumeText.substring(0, 2000)
                : resumeText;

        return "Analyze this resume for a " + jobTitle + " position.\n\n" +
                "Required Skills for this role: " + requiredSkills + "\n\n" +
                "Resume Text:\n" + limitedText + "\n\n" +
                "Return ONLY a valid JSON object with exactly these fields:\n" +
                "{\n" +
                "  \"ats_score\": <number between 0 and 100>,\n" +
                "  \"matched_skills\": \"<comma separated skills found in resume>\",\n" +
                "  \"missing_skills\": \"<comma separated skills not found in resume>\",\n" +
                "  \"suggestions\": \"<3 to 5 improvement suggestions separated by semicolons>\"\n" +
                "}\n" +
                "Return only the JSON object. No markdown. No code blocks. No extra text.";
    }

    private String buildRequestBody(String prompt) throws Exception {
        return "{\n" +
                "  \"model\": \"llama-3.3-70b-versatile\",\n" +
                "  \"messages\": [\n" +
                "    {\n" +
                "      \"role\": \"user\",\n" +
                "      \"content\": " + objectMapper.writeValueAsString(prompt) + "\n" +
                "    }\n" +
                "  ],\n" +
                "  \"temperature\": 0.3\n" +
                "}";
    }

    private String extractTextFromResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        String text = root.path("choices")
                .path(0)
                .path("message")
                .path("content")
                .asText();

        text = text.trim();
        if (text.startsWith("```json")) {
            text = text.substring(7);
        }
        if (text.startsWith("```")) {
            text = text.substring(3);
        }
        if (text.endsWith("```")) {
            text = text.substring(0, text.length() - 3);
        }
        return text.trim();
    }
}