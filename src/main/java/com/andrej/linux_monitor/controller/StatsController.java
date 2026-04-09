package com.andrej.linux_monitor.controller;

import com.andrej.linux_monitor.dto.StatsDto;
import com.andrej.linux_monitor.model.MetricSnapshot;
import com.andrej.linux_monitor.repository.MetricRepository;
import com.andrej.linux_monitor.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;
    private final MetricRepository metricRepository;

    public StatsController(StatsService statsService, MetricRepository metricRepository) {
        this.statsService = statsService;
        this.metricRepository = metricRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsDto> getStats(){
        return ResponseEntity.ok(statsService.getCurrentStats());
    }

    @GetMapping("/stats/history")
    public ResponseEntity<List<MetricSnapshot>> getHistory(
            @RequestParam(defaultValue = "30") int minutes) {
        LocalDateTime since = LocalDateTime.now().minusMinutes(minutes);
        return ResponseEntity.ok(metricRepository.findByRecordedAtAfterOrderByRecordedAtAsc(since));
    }
}