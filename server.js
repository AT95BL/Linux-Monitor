const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

// Endpoint koji pokreće Python skriptu i vraća rezultat
app.get('/api/stats', (req, res) => {
    const pythonProcess = spawn('python3', ['stats.py']);

    pythonProcess.stdout.on('data', (data) => {
        // Podaci dolaze kao Buffer, pa ih pretvaramo u string i šaljemo kao JSON
        const stats = JSON.parse(data.toString());
        res.json(stats);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        res.status(500).json({ error: "Greska pri citanju sistemskih podataka" });
    });
});

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
