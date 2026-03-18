# Linux Monitor

A full-stack, real-time system monitoring platform inspired by Grafana and Zabbix. 
Built with a Java Spring Boot backend, PostgreSQL time-series database, Python system data collector, and a React frontend — all containerized with Docker.

![Dashboard Preview](https://img.shields.io/badge/status-live-brightgreen) 
![Java](https://img.shields.io/badge/Java-21-orange) 
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.3-green) 
![Docker](https://img.shields.io/badge/Docker-containerized-blue) 
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue) 
![React](https://img.shields.io/badge/React-frontend-61dafb)

---

## Features

- **Real-time monitoring** — CPU, RAM, Network RX/TX updated every 3 seconds
- **Time-series persistence** — all metrics saved to PostgreSQL every 5 seconds
- **Live graphs** — CPU history chart + mini charts for RAM, Network RX/TX
- **Top processes** — live process table sorted by CPU usage
- **JWT authentication** — stateless token-based auth with BCrypt password hashing
- **Role-based access control** — Admin, Moderator, Client, and Guest roles
- **Guest preview** — unregistered users see live CPU/RAM with locked overlays on restricted data
- **User registration** — create an account directly from the login screen
- **Dockerized** — single `docker compose up` starts the entire stack
- **Audit log** — tracks admin actions in the database

---

## Architecture

```
React Frontend (port 3000)
        │
        │ REST + JWT
        ▼
Spring Boot API (port 8080)
        │                    │
        │ reads every 5s     │ persists metrics
        ▼                    ▼
  Python stats.py      PostgreSQL DB
  (reads /proc/*)      (metrics + users)
```

The Python daemon reads directly from the Linux kernel (`/proc/stat`, `/proc/meminfo`, `/proc/net/dev`) and is called on a Spring `@Scheduled` timer — not on every request. 
This means zero per-request overhead for metric collection.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 4.0.3 |
| Security | Spring Security, JWT (jjwt 0.12.6), BCrypt |
| Database | PostgreSQL 16 |
| ORM | Spring Data JPA, Hibernate 7 |
| System collector | Python 3 (reads `/proc/*`) |
| Frontend | React 18, Recharts, Axios |
| Containerization | Docker, Docker Compose |
| Build tool | Maven |

---

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Run with Docker (recommended)

```bash
git clone https://github.com/AT95BL/linux-monitor.git
cd linux-monitor
docker compose up --build
```

- API: `http://localhost:8080`
- Frontend: run separately (see below)

### Register your first user

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"YourPassword123!"}'
```

Promote to admin:

```bash
docker exec -it linux-monitor-db-1 psql -U andrej -d linux_monitor \
  -c "UPDATE users SET role='ADMIN' WHERE username='admin';"
```

### Run the frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`

### Run locally (without Docker)

1. Install Java 21, PostgreSQL, Python 3
2. Create the database:
```sql
CREATE DATABASE linux_monitor;
CREATE USER andrej WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE linux_monitor TO andrej;
GRANT ALL ON SCHEMA public TO andrej;
```
3. Configure `src/main/resources/application.properties`
4. Run from IntelliJ or:
```bash
./mvnw spring-boot:run
```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Current system metrics (CPU, RAM, network, processes) |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Authenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/history?minutes=30` | Historical metrics from DB |

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Role Permissions

| Feature | Guest | Client | Moderator | Admin |
|---------|-------|--------|-----------|-------|
| Live CPU & RAM | ✅ | ✅ | ✅ | ✅ |
| Network stats | ❌ | ✅ | ✅ | ✅ |
| Process table | ❌ | ✅ | ✅ | ✅ |
| Metric history | ❌ | ✅ | ✅ | ✅ |
| Export data | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Audit log | ❌ | ❌ | ❌ | ✅ |

---

## Database Schema

```sql
-- Time-series metrics table
CREATE TABLE metrics (
    id           BIGSERIAL PRIMARY KEY,
    recorded_at  TIMESTAMP,
    cpu_percent  FLOAT,
    ram_used_mb  BIGINT,
    ram_total_mb BIGINT,
    ram_percent  FLOAT,
    rx_mb        FLOAT,
    tx_mb        FLOAT
);

-- Users table
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50) UNIQUE NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20),
    created_at  TIMESTAMP,
    last_login  TIMESTAMP,
    active      BOOLEAN DEFAULT true
);
```

---

## Project Structure

```
linux-monitor/
├── src/main/java/com/andrej/linux_monitor/
│   ├── config/          # SecurityConfig
│   ├── controller/      # StatsController, AuthController
│   ├── dto/             # StatsDto, AuthResponse, LoginRequest, RegisterRequest
│   ├── model/           # MetricSnapshot, User, Role
│   ├── repository/      # MetricRepository, UserRepository
│   ├── security/        # JwtUtil, JwtFilter
│   └── service/         # StatsService, MetricCollector, AuthService, UserDetailsServiceImpl
├── frontend/
│   └── src/
│       └── App.js       # React dashboard with auth
├── stats.py             # Python system metrics collector
├── Dockerfile           # Multi-stage build
├── docker-compose.yml   # App + PostgreSQL services
└── pom.xml
```

---

## Screenshots

> Dashboard — authenticated user

![Dashboard](https://via.placeholder.com/800x450.png?text=Dashboard+Screenshot)

> Login screen with guest preview option

![Login](https://via.placeholder.com/800x450.png?text=Login+Screenshot)

---

## What I Learned

- Designing a **multi-layer Java backend** with Spring Boot, JPA, and Spring Security
- Implementing **stateless JWT authentication** with role-based access control
- Using **@Scheduled** for background tasks instead of per-request processing
- Reading Linux kernel data from `/proc` filesystem using Python
- **Multi-stage Docker builds** to minimize image size
- Connecting a containerized Spring Boot app to a containerized PostgreSQL instance
- Building a **Grafana-style React dashboard** with real-time data

---

## Author

**Andrej Trožić**
- GitHub: [@AT95BL](https://github.com/AT95BL)
- LinkedIn: [Andrej Trožić](https://linkedin.com/in/andrej-trožić)
- Portfolio: [at95-portfolio.com](https://at95bl.github.io/html-portfolio/)

---

## License

MIT License — feel free to use this project as a reference or starting point.
