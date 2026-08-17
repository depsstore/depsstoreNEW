/**
 * proxy.js - CORS Proxy untuk Apps Script
 * Jalankan: node proxy.js
 */

const http = require('http');
const https = require('https');
const url = require('url');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgbn6S0sKU4Z46kCdPrPTgmsRYvsloN30lytZHNSWaFRGev4oqzVvXnKODWAKgDbW0/exec';

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '3600');

    // Handle preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 🔥 FIX: Handle root path
    if (req.url === '/' || req.url === '') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'DepsStore API Proxy',
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
            },
            docs: 'Gunakan /api/v2/... untuk mengakses API'
        }));
        return;
    }

    // Build target URL
    var targetUrl = APPS_SCRIPT_URL + req.url;
    console.log('[' + new Date().toISOString() + '] ' + req.method + ' ' + targetUrl);

    var parsedUrl = url.parse(targetUrl);

    var options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        method: req.method,
        headers: {}
    };

    // Copy headers (kecuali host dan connection)
    for (var key in req.headers) {
        if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
            options.headers[key] = req.headers[key];
        }
    }

    // Kumpulkan body untuk POST/PUT
    var body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function() {
        var proxyReq = https.request(options, function(proxyRes) {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);

            proxyRes.on('data', function(chunk) {
                res.write(chunk);
            });

            proxyRes.on('end', function() {
                res.end();
            });
        });

        proxyReq.on('error', function(err) {
            console.error('Proxy error:', err.message);
            res.writeHead(500);
            res.end(JSON.stringify({
                success: false,
                error: 'Proxy error: ' + err.message
            }));
        });

        if (body) {
            proxyReq.write(body);
        }
        proxyReq.end();
    });
});

var PORT = 3000;
server.listen(PORT, function() {
    console.log('==============================');
    console.log('CORS Proxy siap!');
    console.log('==============================');
    console.log('Port    : ' + PORT);
    console.log('Target  : ' + APPS_SCRIPT_URL);
    console.log('');
    console.log('Gunakan : http://localhost:' + PORT + '/api/v2/...');
    console.log('==============================');
    console.log('');
    console.log('Tekan Ctrl+C untuk berhenti');
});