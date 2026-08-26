// api/index.js - Vercel Serverless Function
const https = require('https');
const http = require('http');
const url = require('url');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec';

function fetchRequest(targetUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(targetUrl);
    const isHttps = parsedUrl.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.path || '/',
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '3600');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.url || '/';
  console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);

  try {
    // 🔥 ROOT
    if (path === '/' || path === '') {
      res.status(200).json({
        success: true,
        message: 'DepsStore API v2',
        version: '2.9.0',
        endpoints: {
          health: '/api/v2/system/health',
          login: '/api/v2/auth/login',
          register: '/api/v2/auth/register',
          products: '/api/v2/products',
          orders: '/api/v2/orders',
          support: '/api/v2/support',
          stats: '/api/v2/stats',
          payment: {
            create: '/api/v2/payment/create (POST)',
            status: '/api/v2/payment/status/:id (GET)'
          }
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 🔥 HEALTH
    if (path === '/health' || path === '/api/v2/system/health') {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.9.0',
        environment: 'production'
      });
      return;
    }

    // 🔥 PRODUCTS
    if (path.startsWith('/api/v2/products')) {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getProducts`;
      const response = await fetchRequest(targetUrl);
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 ORDERS
    if (path.startsWith('/api/v2/orders')) {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getOrders`;
      const response = await fetchRequest(targetUrl);
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 AUTH
    if (path.startsWith('/api/v2/auth/')) {
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

      const targetUrl = `${APPS_SCRIPT_URL}?action=login`;
      const response = await fetchRequest(targetUrl, {
        method: req.method,
        headers: headers,
        body: body
      });
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 STATS
    if (path.startsWith('/api/v2/stats')) {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getStats`;
      const response = await fetchRequest(targetUrl);
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 SUPPORT
    if (path.startsWith('/api/v2/support')) {
      const targetUrl = `${APPS_SCRIPT_URL}?action=createSupport`;
      const response = await fetchRequest(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {})
      });
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 PAYMENT CREATE (POST)
    if (path === '/api/v2/payment/create' && req.method === 'POST') {
      res.status(200).json({
        success: true,
        data: {
          transactionId: 'MOCK-' + Date.now(),
          qrUrl: 'https://via.placeholder.com/300x300?text=QRIS',
          paymentUrl: 'https://app.buatqris.site/trx/MOCK-' + Date.now(),
          amount: req.body.amount || 0,
          totalAmount: req.body.amount || 0,
          status: 'pending',
          isTest: true,
          expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      });
      return;
    }

    // 🔥 PAYMENT STATUS (GET)
    if (path.startsWith('/api/v2/payment/status/')) {
      const transactionId = path.split('/').pop();
      res.status(200).json({
        success: true,
        data: {
          transactionId: transactionId,
          status: 'pending',
          amount: 0,
          totalAmount: 0,
          isTest: true
        }
      });
      return;
    }

    // 🔥 API V2 ROOT
    if (path === '/api/v2' || path === '/api/v2/') {
      res.status(200).json({
        success: true,
        message: 'DepsStore API v2',
        version: '2.9.0',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 🔥 404
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      path: path,
      method: req.method
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};
