// Forziamo Node a usare Cloudflare + Google DNS
const dns = require('dns');
dns.setServers([
  '1.1.1.1',   // Cloudflare
  '8.8.8.8',   // Google
]);


// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const N8N_URL = 'http://localhost:5678';

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public')); // Serve i file statici dalla cartella 'public'

// Proxy endpoint per n8n webhooks
app.post('/api/webhook/:webhookName', async (req, res) => {
    try {
        const { webhookName } = req.params;
        const webhookUrl = `${N8N_URL}/webhook/${webhookName}`;
        
        console.log(`📡 Inoltro richiesta a: ${webhookUrl}`);
        console.log('📦 Payload:', JSON.stringify(req.body, null, 2));
        
        const response = await axios.post(webhookUrl, req.body, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000 // 30 secondi di timeout
        });
        
        console.log('✅ Risposta da n8n:', response.status);
        res.status(response.status).json(response.data);
        
    } catch (error) {
        console.error('❌ Errore proxy:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                error: 'n8n non è raggiungibile', 
                message: 'Assicurati che n8n sia in esecuzione su localhost:5678' 
            });
        } else if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ 
                error: 'Errore interno del server', 
                message: error.message 
            });
        }
    }
});

// Endpoint di test per verificare la connessione
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        n8n_url: N8N_URL 
    });
});

// Test connessione n8n
app.get('/api/test-n8n', async (req, res) => {
    try {
        const response = await axios.get(`${N8N_URL}/healthz`, { timeout: 5000 });
        res.json({ 
            n8n_status: 'OK', 
            n8n_response: response.data 
        });
    } catch (error) {
        res.status(503).json({ 
            n8n_status: 'DOWN', 
            error: error.message 
        });
    }
});

// Serve il file HTML principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server Express avviato su http://localhost:${PORT}`);
    console.log(`🔗 Proxy per n8n: ${N8N_URL}`);
    console.log(`📁 File statici serviti da: ./public/`);
    console.log('');
    console.log('Endpoints disponibili:');
    console.log(`  GET  /                    - Frontend HTML`);
    console.log(`  GET  /api/health          - Stato del server`);
    console.log(`  GET  /api/test-n8n        - Test connessione n8n`);
    console.log(`  POST /api/webhook/*       - Proxy per webhooks n8n`);
});