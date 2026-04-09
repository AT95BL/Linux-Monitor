package com.andrej.linux_monitor.service;

import com.andrej.linux_monitor.dto.AdminStatsDto;
import com.andrej.linux_monitor.dto.UserSummaryDto;
import com.andrej.linux_monitor.exception.ResourceNotFoundException;
import com.andrej.linux_monitor.model.AuditLog;
import com.andrej.linux_monitor.model.Role;
import com.andrej.linux_monitor.model.User;
import com.andrej.linux_monitor.repository.AuditRepository;
import com.andrej.linux_monitor.repository.MetricRepository;
import com.andrej.linux_monitor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final MetricRepository metricRepository;
    private final AuditRepository auditRepository;

    public List<UserSummaryDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserSummaryDto(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getRole(),
                        u.getCreatedAt(),
                        u.getLastLogin(),
                        u.isActive()
                )).toList();
    }

    public UserSummaryDto updateRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));

        String oldRole = user.getRole().name();
        user.setRole(newRole);
        userRepository.save(user);

        saveAudit("ROLE_CHANGE",
                user.getUsername() + " role changed from " + oldRole + " to " + newRole.name());

        return new UserSummaryDto(user.getId(), user.getUsername(), user.getEmail(),
                user.getRole(), user.getCreatedAt(), user.getLastLogin(), user.isActive());
    }

    public UserSummaryDto toggleStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));

        user.setActive(!user.isActive());
        userRepository.save(user);

        saveAudit(user.isActive() ? "USER_UNBANNED" : "USER_BANNED",
                user.getUsername() + " active status set to " + user.isActive());

        return new UserSummaryDto(user.getId(), user.getUsername(), user.getEmail(),
                user.getRole(), user.getCreatedAt(), user.getLastLogin(), user.isActive());
    }

    public List<AuditLog> getAuditLog() {
        return auditRepository.findAllByOrderByPerformedAtDesc();
    }

    public AdminStatsDto getSummary() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(User::isActive).count();
        long totalMetrics = metricRepository.count();

        String oldest = metricRepository.findAll().stream()
                .map(m -> m.getRecordedAt() != null ? m.getRecordedAt().toString() : "N/A")
                .min(String::compareTo)
                .orElse("No data");

        return new AdminStatsDto(totalUsers, activeUsers, totalMetrics, oldest);
    }

    private void saveAudit(String action, String description) {
        String performedBy = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        AuditLog log = new AuditLog();
        log.setPerformedBy(performedBy);
        log.setAction(action);
        log.setTargetUser(description);
        log.setPerformedAt(LocalDateTime.now());
        auditRepository.save(log);
    }
}