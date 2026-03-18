package com.andrej.linux_monitor.repository;

import com.andrej.linux_monitor.model.MetricSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MetricRepository extends JpaRepository<MetricSnapshot, Long> {
    List<MetricSnapshot> findByRecordedAtAfterOrderByRecordedAtAsc(LocalDateTime since);
}