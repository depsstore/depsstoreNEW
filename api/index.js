/**
 * api/index.js - Vercel Serverless Function
 * @version 2.9.0
 */

<<<<<<< HEAD
// 🔥 APPS SCRIPT URL - PAKAI YANG BARU
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec';

// 🔥 MOCK DATA (Fallback jika Apps Script error)
const MOCK_PRODUCTS = {
    success: true,
    items: [{
            id: 'mock-1',
            name: 'Jam Tangan Minimalis',
            price: 250000,
            stock: 15,
            category: 'Aksesoris',
            image: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Watch'
        },
        {
            id: 'mock-2',
            name: 'Kacamata Retro',
            price: 180000,
            stock: 8,
            category: 'Fashion',
            image: 'https://via.placeholder.com/300x300/7C3AED/FFFFFF?text=Glasses'
        },
        {
            id: 'mock-3',
            name: 'Tas Kulit Premium',
            price: 450000,
            stock: 5,
            category: 'Aksesoris',
            image: 'https://via.placeholder.com/300x300/0891B2/FFFFFF?text=Bag'
        },
        {
            id: 'mock-4',
            name: 'Sepatu Casual',
            price: 350000,
            stock: 12,
            category: 'Fashion',
            image: 'https://via.placeholder.com/300x300/059669/FFFFFF?text=Shoes'
        },
        {
            id: 'mock-5',
            name: 'Tumbler Stainless',
            price: 120000,
            stock: 20,
            category: 'Perlengkapan',
            image: 'https://via.placeholder.com/300x300/D97706/FFFFFF?text=Tumbler'
        },
        {
            id: 'mock-6',
            name: 'Dompet Minimalis',
            price: 95000,
            stock: 25,
            category: 'Aksesoris',
            image: 'https://via.placeholder.com/300x300/DC2626/FFFFFF?text=Wallet'
        }
    ],
    pagination: {
        total: 6,
        limit: 8,
        offset: 0
    },
    timestamp: new Date().toISOString(),
    _source: 'mock-data'
};

// ============================================================
// HELPER: FETCH REQUEST
// ============================================================

function fetchRequest(targetUrl, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(targetUrl);
        const isHttps = url.protocol === 'https:';
        const httpModule = isHttps ? require('https') : require('http');

        const requestOptions = {
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = httpModule.request(requestOptions, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve({
                    status: response.statusCode,
                    headers: response.headers,
                    data: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

// ============================================================
// VERCELL SERVERLESS HANDLER
// ============================================================

module.exports = async(req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '3600');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const path = req.url || '/';
    console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);

    // ============================================================
    // ROOT
    // ============================================================
    if (path === '/' || path === '') {
        res.status(200).json({
            success: true,
            message: 'DepsStore API v2',
            version: '2.9.0',
            endpoints: {
                health: '/api/v2/system/health',
                test: '/api/v2/test',
                products: '/api/v2/products',
                login: '/api/v2/auth/login',
                register: '/api/v2/auth/register',
                orders: '/api/v2/orders',
                customers: '/api/v2/customers'
            },
            timestamp: new Date().toISOString()
        });
        return;
    }

    // ============================================================
    // HEALTH CHECK
    // ============================================================
    if (path === '/health' || path === '/api/v2/system/health') {
        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '2.9.0',
            environment: 'production'
        });
        return;
    }

    // ============================================================
    // TEST ENDPOINT
    // ============================================================
    if (path === '/api/v2/test') {
        try {
            const response = await fetchRequest(`${APPS_SCRIPT_URL}/api/v2/products?limit=1`);

            const isHTML = response.data && (response.data.trim().startsWith('<!DOCTYPE') || response.data.trim().startsWith('<html'));
            const isConfigError = response.data && (response.data.includes('config is not defined') || response.data.includes('ReferenceError'));

            res.status(200).json({
                success: true,
                message: 'Apps Script Connection Test',
                appsScript: {
                    url: APPS_SCRIPT_URL,
                    status: response.status,
                    contentType: response.headers['content-type'],
                    isHTML: isHTML,
                    hasConfigError: isConfigError,
                    preview: response.data ? response.data.substring(0, 300) : 'No data'
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(200).json({
                success: false,
                error: 'Cannot connect to Apps Script',
                message: error.message,
                url: APPS_SCRIPT_URL
            });
        }
        return;
    }

    // ============================================================
    // PRODUCTS - Dengan Fallback
    // ============================================================
    if (path.startsWith('/api/v2/products') || path.startsWith('/api/v2/produk')) {
        try {
            const targetUrl = APPS_SCRIPT_URL + path;
            console.log(`  → Fetching: ${targetUrl}`);

            const response = await fetchRequest(targetUrl);

            // Cek error config
            if (response.data && (response.data.includes('config is not defined') ||
                    response.data.includes('ReferenceError') ||
                    response.data.includes('Internal server error'))) {
                console.log('  ⚠️ Apps Script error, using mock data');
                res.status(200).json({
                    ...MOCK_PRODUCTS,
                    _note: 'Using mock data because Apps Script returned error',
                    _error: response.data.substring(0, 200)
                });
                return;
            }

            // Cek HTML
            if (response.data && (response.data.trim().startsWith('<!DOCTYPE') || response.data.trim().startsWith('<html'))) {
                console.log('  ⚠️ Apps Script returned HTML, using mock data');
                res.status(200).json({
                    ...MOCK_PRODUCTS,
                    _note: 'Using mock data because Apps Script returned HTML'
                });
                return;
            }

            // Parse JSON
            try {
                const jsonData = JSON.parse(response.data);
                res.status(response.status || 200).json(jsonData);
            } catch (e) {
                console.log('  ⚠️ Invalid JSON, using mock data');
                res.status(200).json({
                    ...MOCK_PRODUCTS,
                    _note: 'Using mock data because Apps Script response is not valid JSON'
                });
            }
        } catch (error) {
            console.log('  ❌ Error fetching from Apps Script, using mock data');
            res.status(200).json({
                ...MOCK_PRODUCTS,
                _note: 'Using mock data because Apps Script is unreachable',
                _error: error.message
            });
        }
        return;
    }

    // ============================================================
    // AUTH ENDPOINTS (Login, Register, etc)
    // ============================================================
    if (path.startsWith('/api/v2/auth/')) {
        try {
            const targetUrl = APPS_SCRIPT_URL + path;
            console.log(`  → Auth proxy to: ${targetUrl}`);

            // Parse body untuk POST/PUT
            let body = '';
            if (req.method === 'POST' || req.method === 'PUT') {
                body = JSON.stringify(req.body || {});
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            if (req.headers.authorization) {
                headers['Authorization'] = req.headers.authorization;
            }

            const response = await fetchRequest(targetUrl, {
                method: req.method,
                headers: headers,
                body: body
            });

            try {
                const jsonData = JSON.parse(response.data);
                res.status(response.status || 200).json(jsonData);
            } catch (e) {
                res.status(response.status || 500).json({
                    success: false,
                    error: 'Invalid response from Apps Script',
                    preview: response.data ? response.data.substring(0, 200) : 'No data'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Proxy error: ' + error.message
            });
        }
        return;
    }

    // ============================================================
    // DASHBOARD
    // ============================================================
    if (path.startsWith('/api/v2/dashboard')) {
        try {
            const targetUrl = APPS_SCRIPT_URL + path;
            console.log(`  → Dashboard proxy to: ${targetUrl}`);

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            if (req.headers.authorization) {
                headers['Authorization'] = req.headers.authorization;
            }

            const response = await fetchRequest(targetUrl, {
                method: req.method,
                headers: headers
            });

            try {
                const jsonData = JSON.parse(response.data);
                res.status(response.status || 200).json(jsonData);
            } catch (e) {
                res.status(response.status || 500).json({
                    success: false,
                    error: 'Invalid response from Apps Script'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Proxy error: ' + error.message
            });
        }
        return;
    }

    // ============================================================
    // BACKUP
    // ============================================================
    if (path.startsWith('/api/v2/backups')) {
        try {
            const targetUrl = APPS_SCRIPT_URL + path;
            console.log(`  → Backup proxy to: ${targetUrl}`);

            let body = '';
            if (req.method === 'POST' || req.method === 'PUT') {
                body = JSON.stringify(req.body || {});
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            if (req.headers.authorization) {
                headers['Authorization'] = req.headers.authorization;
            }

            const response = await fetchRequest(targetUrl, {
                method: req.method,
                headers: headers,
                body: body
            });

            try {
                const jsonData = JSON.parse(response.data);
                res.status(response.status || 200).json(jsonData);
            } catch (e) {
                res.status(response.status || 500).json({
                    success: false,
                    error: 'Invalid response from Apps Script'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Proxy error: ' + error.message
            });
        }
        return;
    }

    // ============================================================
    // ORDERS
    // ============================================================
    if (path.startsWith('/api/v2/orders')) {
        try {
            const targetUrl = APPS_SCRIPT_URL + path;
            console.log(`  → Orders proxy to: ${targetUrl}`);

            let body = '';
            if (req.method === 'POST' || req.method === 'PUT') {
                body = JSON.stringify(req.body || {});
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            if (req.headers.authorization) {
                headers['Authorization'] = req.headers.authorization;
            }

            const response = await fetchRequest(targetUrl, {
                method: req.method,
                headers: headers,
                body: body
            });

            try {
                const jsonData = JSON.parse(response.data);
                res.status(response.status || 200).json(jsonData);
            } catch (e) {
                res.status(response.status || 500).json({
                    success: false,
                    error: 'Invalid response from Apps Script'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Proxy error: ' + error.message
            });
        }
        return;
    }

    // ============================================================
    // CUSTOMERS
    // ============================================================
    if (path.startsWith('/api/v2/customers')) {
        try {
            const targetUrl = APPS_SCRIPT_URL + path;
            console.log(`  → Customers proxy to: ${targetUrl}`);

            let body = '';
            if (req.method === 'POST' || req.method === 'PUT') {
                body = JSON.stringify(req.body || {});
            }

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            if (req.headers.authorization) {
                headers['Authorization'] = req.headers.authorization;
            }

            const response = await fetchRequest(targetUrl, {
                method: req.method,
                headers: headers,
                body: body
            });

            try {
                const jsonData = JSON.parse(response.data);
                res.status(response.status || 200).json(jsonData);
            } catch (e) {
                res.status(response.status || 500).json({
                    success: false,
                    error: 'Invalid response from Apps Script'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Proxy error: ' + error.message
            });
        }
        return;
    }

    // ============================================================
    // API V2 ROOT
    // ============================================================
    if (path === '/api/v2' || path === '/api/v2/') {
        res.status(200).json({
            success: true,
            message: 'DepsStore API v2',
            version: '2.9.0',
            endpoints: {
                health: '/api/v2/system/health',
                test: '/api/v2/test',
                products: '/api/v2/products',
                login: '/api/v2/auth/login',
                register: '/api/v2/auth/register',
                orders: '/api/v2/orders',
                customers: '/api/v2/customers',
                dashboard: '/api/v2/dashboard',
                backups: '/api/v2/backups',
                logs: '/api/v2/logs'
            },
            timestamp: new Date().toISOString()
        });
        return;
    }

    // ============================================================
    // 404 - Endpoint Tidak Ditemukan
    // ============================================================
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: path,
        method: req.method,
        timestamp: new Date().toISOString()
    });
};
=======
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
>>>>>>> 9df786c1bcd5551dcb1a2c5d6963d509b1070ed9
