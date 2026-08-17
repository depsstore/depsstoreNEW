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

// 🔥 TAMBAHKAN: Log semua request
app.use((req, res, next) => {
    console.log('📥 Request:', req.method, req.url);
    next();
});

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgbn6S0sKU4Z46kCdPrPTgmsRYvsloN30lytZHNSWaFRGev4oqzVvXnKODWAKgDbW0/exec';

// 🔥 TEST ENDPOINT PALING SIMPLE
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
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
        }
    });
});

// Health check
app.get('/api/v2/system/health', async (req, res) => {
    try {
        console.log('🩺 Health check requested');
        const response = await fetch(APPS_SCRIPT_URL + '/api/v2/system/health');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Health error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Products
app.get('/api/v2/products', async (req, res) => {
    try {
        console.log('📦 Products requested');
        const url = APPS_SCRIPT_URL + '/api/v2/products';
        const response = await fetch(url);
        
        if (!response.ok) {
            const text = await response.text();
            console.error('Products error:', text.substring(0, 200));
            return res.status(502).json({
                success: false,
                error: 'Apps Script error',
                details: text.substring(0, 200)
            });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login
app.post('/api/v2/auth/login', async (req, res) => {
    try {
        console.log('🔐 Login requested');
        const response = await fetch(APPS_SCRIPT_URL + '/api/v2/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Register
app.post('/api/v2/auth/register', async (req, res) => {
    try {
        console.log('📝 Register requested');
        const response = await fetch(APPS_SCRIPT_URL + '/api/v2/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔥 FALLBACK: Semua request /api/*
app.all('/api/*', async (req, res) => {
    try {
        const path = req.path;
        const url = APPS_SCRIPT_URL + path;
        console.log('🔄 Proxy:', req.method, url);
        
        const options = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || ''
            }
        };

        if (req.method === 'POST' || req.method === 'PUT') {
            options.body = JSON.stringify(req.body);
        }

        const response = await fetch(url, options);
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

// 🔥 ROOT
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'DepsStore API Server',
        version: '2.9.0',
        endpoints: {
            test: '/api/test',
            api: '/api/v2'
        }
    });
});

// 🔥 404 handler
app.use((req, res) => {
    console.log('❌ 404:', req.method, req.url);
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.url,
        method: req.method
    });
});

export default app;
