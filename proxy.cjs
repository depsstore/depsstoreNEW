/**
 * proxy.cjs - CORS Proxy untuk Apps Script (CommonJS)
 * Jalankan: node proxy.cjs
 * 
 * 🔥 PASTIKAN APPS SCRIPT URL BENAR
 */

const http = require('http');
const https = require('https');
const url = require('url');

// 🔥 GANTI DENGAN URL DEPLOY APPS SCRIPT ANDA
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec';

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

    console.log('[' + new Date().toISOString() + '] ' + req.method + ' ' + req.url);

    // 🔥 Handle root path
    if (req.url === '/' || req.url === '') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'DepsStore API Proxy',
            version: '2.9.0',
            endpoints: {
                health: '/api/v2/system/health',
                test: '/api/v2/test',
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
        }));
        return;
    }

    // Build target URL
    var targetUrl = APPS_SCRIPT_URL + req.url;
    console.log('  → Proxying to: ' + targetUrl);

    var parsedUrl = url.parse(targetUrl);

    var options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        method: req.method,
        headers: {
            'Accept': 'application/json'
        }
    };

    // Copy headers
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
            var contentType = proxyRes.headers['content-type'] || '';
            var isJSON = contentType.includes('application/json');

            var data = '';
            proxyRes.on('data', function(chunk) {
                data += chunk;
            });

            proxyRes.on('end', function() {
                // 🔥 Jika bukan JSON, cek apakah HTML
                if (!isJSON && (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html'))) {
                    console.warn('  ⚠️ Apps Script returned HTML');
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Apps Script returned HTML',
                        status: proxyRes.statusCode,
                        preview: data.substring(0, 300)
                    }));
                    return;
                }

                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': contentType || 'application/json'
                });
                res.end(data);
            });
        });

        proxyReq.on('error', function(err) {
            console.error('  ❌ Proxy error:', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
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
    console.log('🔄 CORS Proxy siap!');
    console.log('==============================');
    console.log('Port    : ' + PORT);
    console.log('Target  : ' + APPS_SCRIPT_URL);
    console.log('');
    console.log('📌 Test    : http://localhost:' + PORT + '/api/v2/test');
    console.log('📌 Health  : http://localhost:' + PORT + '/api/v2/system/health');
    console.log('📌 Products: http://localhost:' + PORT + '/api/v2/products');
    console.log('==============================');
});