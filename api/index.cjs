/**
 * api/index.js - Vercel Serverless Function (ES Module)
 * @version 2.9.0
 */

// 🔥 FIX: Gunakan import (ES Module)
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgbn6S0sKU4Z46kCdPrPTgmsRYvsloN30lytZHNSWaFRGev4oqzVvXnKODWAKgDbW0/exec';

// Health check
app.get('/api/v2/system/health', async(req, res) => {
    try {
        const response = await fetch(APPS_SCRIPT_URL + '/api/v2/system/health');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Health error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Root API
app.get('/api/v2', (req, res) => {
    res.json({
        success: true,
        message: 'DepsStore API v2',
        version: '2.9.0',
        endpoints: {
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

// Products
app.get('/api/v2/products', async(req, res) => {
    try {
        const response = await fetch(APPS_SCRIPT_URL + '/api/v2/products');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login
app.post('/api/v2/auth/login', async(req, res) => {
    try {
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
app.post('/api/v2/auth/register', async(req, res) => {
    try {
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

// Proxy fallback
app.all('/api/v2/*', async(req, res) => {
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

// 🔥 FIX: Export default (ES Module)
export default app;