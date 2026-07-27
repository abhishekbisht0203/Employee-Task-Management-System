package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.LoginRequest;
import com.eventxplora.taskmanager.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
