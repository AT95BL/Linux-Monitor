package com.andrej.linux_monitor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long activeUsers;
    private long totalMetricSnapshots;
    private String oldestMetric;
}