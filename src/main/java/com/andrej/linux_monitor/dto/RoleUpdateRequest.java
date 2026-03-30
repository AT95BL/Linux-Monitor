package com.andrej.linux_monitor.dto;

import com.andrej.linux_monitor.model.Role;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    private Role role;
}