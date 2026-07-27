package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.LoginRequest;
import com.eventxplora.taskmanager.dto.LoginResponse;
import com.eventxplora.taskmanager.entity.User;
import com.eventxplora.taskmanager.exception.ResourceNotFoundException;
import com.eventxplora.taskmanager.repository.UserRepository;
import com.eventxplora.taskmanager.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new BadCredentialsException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return new LoginResponse(token, user.getRole().name(), user.getId(), user.getFullName(), user.getEmail());
    }
}
