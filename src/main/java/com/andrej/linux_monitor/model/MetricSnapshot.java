package com.andrej.linux_monitor.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "metrics")
public class MetricSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime recordedAt;
    private double cpuPercent;
    private long ramUsedMb;
    private long ramTotalMb;
    private double ramPercent;
    private double rxMb;
    private double txMb;
}