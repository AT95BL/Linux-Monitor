package com.andrej.linux_monitor.controller;

import com.andrej.linux_monitor.dto.AdminStatsDto;
import com.andrej.linux_monitor.dto.RoleUpdateRequest;
import com.andrej.linux_monitor.dto.UserSummaryDto;
import com.andrej.linux_monitor.model.AuditLog;
import com.andrej.linux_monitor.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserSummaryDto> updateRole(
            @PathVariable Long id,
            @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateRole(id, request.getRole()));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserSummaryDto> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleStatus(id));
    }

    @GetMapping("/audit")
    public ResponseEntity<List<AuditLog>> getAuditLog() {
        return ResponseEntity.ok(adminService.getAuditLog());
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getSummary() {
        return ResponseEntity.ok(adminService.getSummary());
    }
}