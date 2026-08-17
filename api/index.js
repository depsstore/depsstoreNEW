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

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgbn6S0sKU4Z46kCdPrPTgmsRYvsloN30lytZHNSWaFRGev4oqzVvXnKODWAKgDbW0/exec';

// 🔥 FIX: Root API
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

// 🔥 FIX: Health Check (SUDAH BERHASIL)
app.get('/api/v2/system/health', async (req, res) => {
    try {
        const url = APPS_SCRIPT_URL + '/api/v2/system/health';
        console.log('Fetching health:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Health error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🔥 FIX: Products - PASTIKAN PATH BENAR
app.get('/api/v2/products', async (req, res) => {
    try {
        // 🔥 PERHATIKAN: Tidak ada '/api/v2' tambahan
        const url = APPS_SCRIPT_URL + '/api/v2/products';
        console.log('Fetching products:', url);
        
        const response = await fetch(url);
        
        // 🔥 Cek response
        if (!response.ok) {
            const text = await response.text();
            console.error('Products error response:', text.substring(0, 200));
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
        console.error('Products error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🔥 FIX: Login
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

// 🔥 FIX: Register
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

// 🔥 FIX: Products dengan query params (search, filter)
app.get('/api/v2/products/*', async (req, res) => {
    try {
        const path = req.path.replace('/api/v2/products', '');
        const url = APPS_SCRIPT_URL + '/api/v2/products' + path + '?' + new URLSearchParams(req.query).toString();
        console.log('Fetching products with query:', url);
        
        const response = await fetch(url);
        
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
        console.error('Products query error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🔥 FIX: Proxy fallback untuk endpoint lain
app.all('/api/v2/*', async (req, res) => {
    try {
        // Ambil path setelah /api/v2
        const path = req.path.replace('/api/v2', '');
        const url = APPS_SCRIPT_URL + '/api/v2' + path;
        
        console.log('Proxy:', req.method, url);

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

// 🔥 EXPORT
export default app;
