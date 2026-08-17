/**
 * api/index.js - Vercel Serverless Function
 * @version 2.9.0
 */

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

// APPS SCRIPT URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7PscckTNRF6nvp7Rrsi21luQJu67pt8Yq4lITtLDxvL_3n8Nlwoxuto-0jPQ2ATGV/exec';

// Health check
app.get('/api/v2/system/health', async(req, res) => {
    try {
        const response = await fetch(APPS_SCRIPT_URL + '/api/v2/system/health');
        const data = await response.json();
        res.json(data);
    } catch (error) {
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

// Proxy semua request ke Apps Script
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
            body: req.method === 'POST' || req.method === 'PUT' ?
                JSON.stringify(req.body) :
                undefined
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

// Export untuk Vercel
export default app;