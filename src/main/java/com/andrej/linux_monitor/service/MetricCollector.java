package com.andrej.linux_monitor.service;

import com.andrej.linux_monitor.model.MetricSnapshot;
import com.andrej.linux_monitor.repository.MetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
@EnableScheduling
public class MetricCollector {

    private final MetricRepository metricRepository;
    private final StatsService statsService;

    @Scheduled(fixedDelay = 5000)
    public void collect() {
        try {
            var stats = statsService.getCurrentStats();

            MetricSnapshot snapshot = new MetricSnapshot();
            snapshot.setRecordedAt(LocalDateTime.now());
            snapshot.setCpuPercent(stats.getCpu());
            snapshot.setRamUsedMb(stats.getRam().getUsed_mb());
            snapshot.setRamTotalMb(stats.getRam().getTotal_mb());
            snapshot.setRamPercent(stats.getRam().getPercent());
            snapshot.setRxMb(stats.getNetwork().getRx_mb());
            snapshot.setTxMb(stats.getNetwork().getTx_mb());

            metricRepository.save(snapshot);
            log.info("Saved metric snapshot — CPU: {}%", stats.getCpu());
        } catch (Exception e) {
            log.error("Failed to collect metrics: {}", e.getMessage());
        }
    }
}