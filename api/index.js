/**
 * api/index.js - Vercel Serverless Function (Simple)
 * @version 2.9.0
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7PscckTNRF6nvp7Rrsi21luQJu67pt8Yq4lITtLDxvL_3n8Nlwoxuto-0jPQ2ATGV/exec';

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const path = req.url || '/';
    console.log('Request:', req.method, path);

    try {
        // Root API
        if (path === '/' || path === '/api/v2' || path === '/api/v2/') {
            return res.status(200).json({
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
        }

        // Health check
        if (path === '/api/v2/system/health') {
            const response = await fetch(APPS_SCRIPT_URL + '/api/v2/system/health');
            const data = await response.json();
            return res.status(200).json(data);
        }

        // Products
        if (path === '/api/v2/products' || path.startsWith('/api/v2/products?')) {
            const response = await fetch(APPS_SCRIPT_URL + '/api/v2/products');
            const data = await response.json();
            return res.status(200).json(data);
        }

        // Login
        if (path === '/api/v2/auth/login' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            await new Promise(resolve => req.on('end', resolve));

            const response = await fetch(APPS_SCRIPT_URL + '/api/v2/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // Register
        if (path === '/api/v2/auth/register' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            await new Promise(resolve => req.on('end', resolve));

            const response = await fetch(APPS_SCRIPT_URL + '/api/v2/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // Proxy fallback
        const url = APPS_SCRIPT_URL + path;
        const options = {
            method: req.method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (req.method === 'POST' || req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => body += chunk);
            await new Promise(resolve => req.on('end', resolve));
            options.body = body;
        }

        const response = await fetch(url, options);
        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            path: path
        });
    }
};