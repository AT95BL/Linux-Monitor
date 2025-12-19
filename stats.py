import time
import json
import os
import subprocess

def get_ram_usage():
    with open('/proc/meminfo', 'r') as f:
        stats = {line.split(':')[0]: int(line.split(':')[1].split()[0]) for line in f}
    total = stats.get('MemTotal', 0)
    available = stats.get('MemAvailable', 0)
    used = total - available
    return {
        "used_mb": used // 1024,
        "total_mb": total // 1024,
        "percent": round((used / total) * 100, 2)
    }

def get_cpu_usage():
    def read_cpu():
        with open('/proc/stat', 'r') as f:
            line = f.readline()
        data = list(map(int, line.split()[1:]))
        return sum(data), data[3] # total, idle

    t1, i1 = read_cpu()
    time.sleep(0.5) # Smanjili smo pauzu za brži odziv
    t2, i2 = read_cpu()
    
    total_delta = t2 - t1
    idle_delta = i2 - i1
    usage = (1.0 - (idle_delta / total_delta)) * 100
    return round(usage, 2)

def get_network_traffic():
    # Čitamo /proc/net/dev za mrežni saobraćaj (fokus na osnovni interface, npr. wlan0 ili eth0)
    with open('/proc/net/dev', 'r') as f:
        lines = f.readlines()[2:] # Preskačemo header
    
    # Sumiramo sav saobraćaj na svim interfejsima radi jednostavnosti
    rx_bytes = 0
    tx_bytes = 0
    for line in lines:
        parts = line.split()
        rx_bytes += int(parts[1])
        tx_bytes += int(parts[9])
    
    return {
        "rx_mb": round(rx_bytes / (1024 * 1024), 2),
        "tx_mb": round(tx_bytes / (1024 * 1024), 2)
    }


def get_top_processes():
    # Komanda uzima PID, naziv (comm), % memorije i % CPU-a, sortira po CPU i uzima top 5
    cmd = "ps -eo pid,comm,%mem,%cpu --sort=-%cpu | head -n 6"
    output = subprocess.check_output(cmd, shell=True).decode()
    
    lines = output.strip().split('\n')[1:] # Preskačemo header
    processes = []
    for line in lines:
        parts = line.split()
        if len(parts) >= 4:
            processes.append({
                "pid": parts[0],
                "name": parts[1],
                "mem": parts[2],
                "cpu": parts[3]
            })
    return processes

if __name__ == "__main__":
    output = {
        "cpu": get_cpu_usage(),
        "ram": get_ram_usage(),
        "network": get_network_traffic(),
        "os": "Linux Mint",
        "timestamp": time.time(),
        "processes": get_top_processes(),
    }
    print(json.dumps(output)) # Ovo omogućava Node.js-u da lako "proguta" podatke
