# 🐧 Linux System Monitor Dashboard

A full-stack, real-time system monitoring application inspired by professional tools like **Zabbix** and **Prometheus**. T
his project demonstrates the integration of low-level Linux kernel data extraction with modern web technologies and containerization.

## 🚀 Technology Stack

- **Backend:** Node.js (Express) & Python 3 
- **Frontend:** React.js & Recharts 
- **Infrastructure:** Docker & Docker Compose 
- **Data Source:** Linux `/proc` virtual filesystem 

## 🛠️ Key Features

- **Real-time Metrics:** Live tracking of CPU and RAM usage with historical trend charts.
- **Network Insights:** Monitoring of network traffic (RX/TX MB) parsed directly from `/proc/net/dev`.
- **Process Management:** Dynamic list of the top 5 most resource-intensive processes.
- **Dockerized Deployment:** Fully containerized environment with host-to-container volume mapping for system access.

## 🏗️ Architecture Overview

The application follows a three-tier architecture designed for efficiency and modularity:
1. **Python Core:** A high-performance script responsible for parsing `/proc` files. This leverages my experience in systems-level programming and scripting.
2. **Node.js Middleware:** An Express server that spawns Python processes and serves the data as a structured JSON API.
3. **React Dashboard:** A responsive UI that polls the API and renders data using the Recharts library for clear visualization.



## 📦 Getting Started

Ensure you have Docker and Docker Compose installed. You can launch the entire stack with a single command:

```bash
docker-compose up --build

Once the containers are up and running:
- **Frontend Dashboard:** Open your browser and navigate to `http://localhost:3000`
- **Backend API:** Access raw system metrics at `http://localhost:5000/api/stats`

## 🧠 Engineering Challenges & Learnings

### 1. Container Visibility via Volume Mapping
A major challenge was allowing an isolated Docker container to monitor the host system's resources. 
Leveraging my experience with **Linux administration (Mint/Ubuntu)**[cite: 13], I implemented a solution by mounting the host's `/proc` filesystem as a read-only volume. 
This allows the backend to gather real-time data without compromising host security.

### 2. Precise CPU Usage Calculation
Unlike memory, CPU usage cannot be read as a single static value from `/proc/stat`. 
It requires calculating the delta between two snapshots of CPU "ticks" over a time interval. 
My academic background in **computer architecture**  was instrumental in implementing the logic to correctly parse and calculate non-idle CPU percentages.

### 3. Full-Stack Integration
This project served as a practical application of my current focus on **Web Development (Node.js & React)**. 
It bridges the gap between low-level system scripting in **Python** 
and dynamic, responsive data visualization in the frontend.

## 📈 Future Roadmap
- **WebSocket Implementation:** Transitioning from HTTP polling to Socket.io for instantaneous data pushes.
- **Enhanced Process Management:** Adding the ability to send signals (e.g., SIGTERM) to processes directly from the UI.
- **Alerting System:** Integrating custom thresholds for CPU/RAM alerts.

---
Developed by **Andrej Trožić** – Student of Software Engineering at the Faculty of Electrical Engineering, Banja Luka.
