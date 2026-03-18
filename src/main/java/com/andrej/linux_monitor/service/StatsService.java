package com.andrej.linux_monitor.service;

import com.andrej.linux_monitor.dto.StatsDto;
//import com.fasterxml.jackson.databind.ObjectMapper; it doesn't work ..
import tools.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.springframework.beans.factory.annotation.Value;

@Service
public class StatsService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${stats.script.path}")
    private String statsScriptPath;

    public StatsDto getCurrentStats() throws Exception {
        ProcessBuilder pb = new ProcessBuilder("python3", statsScriptPath);
        pb.redirectErrorStream(false);
        Process process = pb.start();

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line);
        }
        process.waitFor();
        return objectMapper.readValue(output.toString(), StatsDto.class);
    }
}