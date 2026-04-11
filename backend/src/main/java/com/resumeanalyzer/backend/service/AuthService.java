package com.resumeanalyzer.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.resumeanalyzer.backend.config.JwtUtil;
import com.resumeanalyzer.backend.model.User;
import com.resumeanalyzer.backend.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, String> register(String name, String email, String password) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByEmail(email)) {
            response.put("error", "Email already exists!");
            return response;
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.USER);
        userRepository.save(user);

        String token = jwtUtil.generateToken(email);
        response.put("token", token);
        response.put("message", "User registered successfully!");
        return response;
    }

    public Map<String, String> login(String email, String password) {
        Map<String, String> response = new HashMap<>();

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            response.put("error", "User not found!");
            return response;
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("error", "Invalid password!");
            return response;
        }

        String token = jwtUtil.generateToken(email);
        response.put("token", token);
        response.put("message", "Login successful!");
        response.put("role", user.getRole().toString());
        return response;
    }
}