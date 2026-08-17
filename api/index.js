/**
 * api/index.cjs - Vercel Serverless Function
 * @version 2.9.0
 */

const express = require('express');
const cors = require('cors');
const app = express();

// 🔥 APPS SCRIPT URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Health check
app.get('/api/v2/system/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.9.0',
        environment: 'production'
    });
});

// Test endpoint
app.get('/api/v2/test', async(req, res) => {
    try {
        const fetch = await
        import ('node-fetch');
        const response = await fetch.default(APPS_SCRIPT_URL + '/api/v2/products?limit=1', {
            headers: { 'Accept': 'application/json' }
        });
        const text = await response.text();
        const isHTML = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html');

        res.json({
            success: true,
            appsScript: {
                url: APPS_SCRIPT_URL,
                status: response.status,
                contentType: response.headers.get('content-type'),
                isHTML: isHTML,
                preview: text.substring(0, 200)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Proxy semua request ke Apps Script
app.all('/api/v2/*', async(req, res) => {
    try {
        const fetch = await
        import ('node-fetch');
        const targetUrl = APPS_SCRIPT_URL + req.url;

        const fetchOptions = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (req.headers.authorization) {
            fetchOptions.headers['Authorization'] = req.headers.authorization;
        }

        if (req.method === 'POST' || req.method === 'PUT') {
            fetchOptions.body = JSON.stringify(req.body);
        }

        console.log('📡 Proxying:', req.method, targetUrl);

        const response = await fetch.default(targetUrl, fetchOptions);
        const data = await response.text();

        // Cek jika response HTML
        if (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html')) {
            console.warn('⚠️ Apps Script returned HTML');
            res.status(500).json({
                success: false,
                error: 'Apps Script returned HTML page. Please check your deployment.',
                preview: data.substring(0, 200)
            });
            return;
        }

        // Parse JSON
        try {
            const jsonData = JSON.parse(data);
            res.status(response.status).json(jsonData);
        } catch (e) {
            res.status(response.status).send(data);
        }
    } catch (error) {
        console.error('❌ Proxy error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Proxy error: ' + error.message
        });
    }
});

// Root
app.get('/', (req, res) => {
    res.json({
        message: 'DepsStore API Vercel',
        version: '2.9.0',
        endpoints: {
            health: '/api/v2/system/health',
            test: '/api/v2/test',
            products: '/api/v2/products',
            login: '/api/v2/auth/login',
            register: '/api/v2/auth/register'
        }
    });
});

module.exports = app;