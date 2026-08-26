// api/index.js - Vercel Serverless Function (PERBAIKAN FINAL)
const https = require('https');
const http = require('http');
const url = require('url');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec';
const BUATQRIS_API = 'https://api.buatqris.site';

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
    if (path === '/' || path === '/api/v2/' || path === '/api/v2') {
      res.status(200).json({
        success: true,
        message: 'DepsStore API v2',
        version: '2.9.0',
        endpoints: {
          health: '/api/v2/system/health',
          products: '/api/v2/products',
          orders: '/api/v2/orders',
          login: '/api/v2/auth/login',
          register: '/api/v2/auth/register',
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

    // 🔥 PRODUCTS (PROXY KE APPS SCRIPT)
    if (path.startsWith('/api/v2/products')) {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getProducts`;
      const response = await fetchRequest(targetUrl);
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 ORDERS (PROXY KE APPS SCRIPT)
    if (path.startsWith('/api/v2/orders')) {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getOrders`;
      const response = await fetchRequest(targetUrl);
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 STATS (PROXY KE APPS SCRIPT)
    if (path.startsWith('/api/v2/stats')) {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getStats`;
      const response = await fetchRequest(targetUrl);
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 AUTH LOGIN (PROXY KE APPS SCRIPT - POST)
    if (path === '/api/v2/auth/login' && req.method === 'POST') {
      const targetUrl = `${APPS_SCRIPT_URL}?action=login`;
      const response = await fetchRequest(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {})
      });
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 AUTH REGISTER (PROXY KE APPS SCRIPT - POST)
    if (path === '/api/v2/auth/register' && req.method === 'POST') {
      const targetUrl = `${APPS_SCRIPT_URL}?action=register`;
      const response = await fetchRequest(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {})
      });
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
      return;
    }

    // 🔥 SUPPORT (PROXY KE APPS SCRIPT - POST)
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

    // 🔥 PAYMENT CREATE (POST) - LANGSUNG KE BUATQRIS
    if (path === '/api/v2/payment/create' && req.method === 'POST') {
      const { amount, subtotal, feeAdmin, customer, description, orderId, isTest } = req.body || {};
      const amountToBuatQris = subtotal ? (subtotal + (feeAdmin || 0)) : amount;

      const params = new URLSearchParams();
      params.append('action', 'api_create_qris');
      params.append('account_id', process.env.BUATQRIS_ACCOUNT_ID || '');
      params.append('secret_token', process.env.BUATQRIS_SECRET_TOKEN || '');
      params.append('amount', String(amountToBuatQris || 0));
      params.append('description', description || 'Pembayaran Order ' + orderId);
      params.append('test', isTest ? '1' : '0');

      const response = await fetchRequest(BUATQRIS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      try {
        const jsonData = JSON.parse(response.data);
        if (jsonData.success) {
          const qrisData = jsonData.data;
          res.status(200).json({
            success: true,
            data: {
              transactionId: qrisData.transaction_id,
              qrUrl: qrisData.qr_url,
              paymentUrl: qrisData.payment_url,
              amount: amountToBuatQris,
              totalAmount: qrisData.total_amount,
              serviceFee: qrisData.total_amount - amountToBuatQris,
              expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
            }
          });
        } else {
          res.status(400).json({ success: false, error: jsonData.message });
        }
      } catch (e) {
        res.status(500).json({ success: false, error: 'Invalid response from BuatQris' });
      }
      return;
    }

    // 🔥 PAYMENT STATUS (GET) - LANGSUNG KE BUATQRIS
    if (path.startsWith('/api/v2/payment/status/')) {
      const transactionId = path.split('/').pop();

      const params = new URLSearchParams();
      params.append('action', 'api_check_status');
      params.append('account_id', process.env.BUATQRIS_ACCOUNT_ID || '');
      params.append('secret_token', process.env.BUATQRIS_SECRET_TOKEN || '');
      params.append('transaction_id', transactionId);

      const response = await fetchRequest(BUATQRIS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      try {
        const jsonData = JSON.parse(response.data);
        if (jsonData.success) {
          const statusData = jsonData.data;
          res.status(200).json({
            success: true,
            data: {
              transactionId: statusData.transaction_id,
              status: statusData.status,
              amount: statusData.amount,
              totalAmount: statusData.total_amount,
              isTest: statusData.is_test
            }
          });
        } else {
          res.status(400).json({ success: false, error: jsonData.message });
        }
      } catch (e) {
        res.status(500).json({ success: false, error: 'Invalid response from BuatQris' });
      }
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
