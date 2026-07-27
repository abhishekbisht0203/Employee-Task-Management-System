package com.eventxplora.taskmanager.service;

import com.eventxplora.taskmanager.dto.CreateEmployeeRequest;
import com.eventxplora.taskmanager.dto.EmployeeResponse;
import com.eventxplora.taskmanager.dto.UpdateEmployeeRequest;
import com.eventxplora.taskmanager.entity.Role;
import com.eventxplora.taskmanager.entity.User;
import com.eventxplora.taskmanager.exception.DuplicateEmailException;
import com.eventxplora.taskmanager.exception.ResourceNotFoundException;
import com.eventxplora.taskmanager.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return userRepository.findByRole(Role.EMPLOYEE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.EMPLOYEE);
        user.setDepartment(request.getDepartment());
        user.setIsActive(true);

        user = userRepository.save(user);
        return toResponse(user);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            if (!request.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateEmailException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user = userRepository.save(user);
        return toResponse(user);
    }

    private EmployeeResponse toResponse(User user) {
        return new EmployeeResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getDepartment(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }
}
