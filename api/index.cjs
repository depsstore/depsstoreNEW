/**
 * api/index.js - Vercel Serverless Function
 * @version 2.9.0
 */

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 🔥 PASTIKAN URL INI BENAR
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgbn6S0sKU4Z46kCdPrPTgmsRYvsloN30lytZHNSWaFRGev4oqzVvXnKODWAKgDbW0/exec';

// 🔥 TAMBAHKAN: Test endpoint langsung
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        appsScriptUrl: APPS_SCRIPT_URL,
        timestamp: new Date().toISOString()
    });
});

// Health check - dengan error handling lebih baik
app.get('/api/v2/system/health', async (req, res) => {
    try {
        const url = APPS_SCRIPT_URL + '/api/v2/system/health';
        console.log('Fetching:', url);
        
        const response = await fetch(url);
        
        // 🔥 Cek status response
        if (!response.ok) {
            const text = await response.text();
            console.error('Apps Script error response:', text.substring(0, 200));
            return res.status(502).json({
                success: false,
                error: 'Apps Script returned error',
                status: response.status,
                details: text.substring(0, 200)
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

// Products
app.get('/api/v2/products', async (req, res) => {
    try {
        const url = APPS_SCRIPT_URL + '/api/v2/products';
        console.log('Fetching products:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const text = await response.text();
            console.error('Products error response:', text.substring(0, 200));
            return res.status(502).json({
                success: false,
                error: 'Apps Script returned error',
                status: response.status
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Login
app.post('/api/v2/auth/login', async (req, res) => {
    try {
        const url = APPS_SCRIPT_URL + '/api/v2/auth/login';
        console.log('Login to:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            const text = await response.text();
            console.error('Login error response:', text.substring(0, 200));
            return res.status(502).json({
                success: false,
                error: 'Apps Script returned error',
                status: response.status
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Register
app.post('/api/v2/auth/register', async (req, res) => {
    try {
        const url = APPS_SCRIPT_URL + '/api/v2/auth/register';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            const text = await response.text();
            return res.status(502).json({
                success: false,
                error: 'Apps Script returned error',
                status: response.status
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Root API
app.get('/api/v2', (req, res) => {
    res.json({
        success: true,
        message: 'DepsStore API v2',
        version: '2.9.0',
        endpoints: {
            test: '/api/test',
            health: '/api/v2/system/health',
            login: '/api/v2/auth/login',
            register: '/api/v2/auth/register',
            products: '/api/v2/products',
            orders: '/api/v2/orders',
            customers: '/api/v2/customers',
            users: '/api/v2/users',
            support: '/api/v2/support',
            dashboard: '/api/v2/dashboard',
            backups: '/api/v2/backups',
            logs: '/api/v2/logs'
        },
        appsScriptUrl: APPS_SCRIPT_URL
    });
});

// Proxy fallback
app.all('/api/v2/*', async (req, res) => {
    try {
        const path = req.path.replace('/api/v2', '');
        const url = APPS_SCRIPT_URL + '/api/v2' + path;
        
        console.log('Proxy:', req.method, url);

        const response = await fetch(url, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || ''
            },
            body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(502).json({
                success: false,
                error: 'Apps Script returned error',
                status: response.status,
                details: text.substring(0, 200)
            });
        }

        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🔥 Export default
export default app;
