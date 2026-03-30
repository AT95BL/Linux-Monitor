package com.andrej.linux_monitor.repository;

import com.andrej.linux_monitor.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByPerformedAtDesc();
}