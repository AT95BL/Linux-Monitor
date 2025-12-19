import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stats');
      setStats(res.data);
      
      // Čuvamo istoriju za grafik (zadnjih 10 mjerenja)
      setHistory(prev => [...prev, { time: new Date().toLocaleTimeString(), cpu: res.data.cpu }].slice(-10));
    } catch (err) {
      console.error("Greška pri preuzimanju podataka", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Osvježi svakih 3 sekunde
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Učitavanje podataka...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: 'white', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h1>Linux Mint System Monitor</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #4caf50' }}>
          <h3>CPU Usage</h3>
          <p style={{ fontSize: '24px' }}>{stats.cpu}%</p>
        </div>
        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #2196f3' }}>
          <h3>RAM Usage</h3>
          <p style={{ fontSize: '24px' }}>{stats.ram.percent}%</p>
          <small>{stats.ram.used_mb} MB / {stats.ram.total_mb} MB</small>
        </div>
        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #ff9800' }}>
          <h3>Network (RX)</h3>
          <p style={{ fontSize: '24px' }}>{stats.network.rx_mb} MB</p>
        </div>
      </div>

      <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', height: '300px' }}>
        <h3>CPU History (Real-time)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} />
            <Line type="monotone" dataKey="cpu" stroke="#4caf50" strokeWidth={3} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '40px', background: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
          <h3>Top Processes (by CPU)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #444', textAlign: 'left', color: '#888' }}>
                <th style={{ padding: '10px' }}>PID</th>
                <th>Process</th>
                <th>Memory %</th>
                <th>CPU %</th>
              </tr>
            </thead>
            <tbody>
              {stats.processes && stats.processes.map((proc, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>{proc.pid}</td>
                  <td style={{ fontWeight: 'bold' }}>{proc.name}</td>
                  <td>{proc.mem}%</td>
                  <td style={{ color: '#4caf50' }}>{proc.cpu}%</td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
   </div>
  );
}

export default App;
