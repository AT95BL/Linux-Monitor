# 1. Koristimo laganu verziju Node.js slike
FROM node:18-slim

# [cite_start]2. Instaliramo Python jer nam stats.py treba za čitanje sistema [cite: 11]
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

# 3. Postavljamo radni direktorij u kontejneru
WORKDIR /app

# [cite_start]4. Kopiramo package.json i instaliramo Node.js zavisnosti 
COPY package*.json ./
RUN npm install

# 5. Kopiramo sve ostale fajlove (server.js, stats.py...)
COPY . .

# 6. Otvaramo port 5000 za naš API
EXPOSE 5000

# 7. Pokrećemo server
CMD ["node", "server.js"]
