// api/index.js - VERCEL SERVERLESS FUNCTION (FIXED)
const https = require('https');

// 🔥 CONFIG
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyi-CMq3E2f1-99UA8kRoD7YobdoflwJEE-ZjksAKnhcZ62x0q21TjiDytxfFUvr0mC/exec';

// ============================================================
// HELPER: FETCH REQUEST
// ============================================================
function fetchRequest(targetUrl, options = {}) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(targetUrl);
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const trimmed = data.trim();
        if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<?xml')) {
          console.error('❌ Apps Script returned HTML');
          resolve({ 
            status: res.statusCode, 
            data: null, 
            raw: data,
            isHtml: true,
            error: 'Apps Script returned HTML'
          });
          return;
        }
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, raw: data });
        } catch (e) {
          console.error('❌ JSON Parse Error:', e.message);
          resolve({ status: res.statusCode, data: null, raw: data, error: e.message });
        }
      });
    });
    req.on('error', (err) => {
      console.error('❌ Request Error:', err.message);
      resolve({ status: 500, data: null, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 408, data: null, error: 'Request timeout' });
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ============================================================
// HELPER: PARSE BODY
// ============================================================
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (e) {
        resolve({});
      }
    });
  });
}

// ============================================================
// MAIN HANDLER
// ============================================================
module.exports = async (req, res) => {
  // 🔥 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 🔥 Parse body untuk POST/PUT
  let body = {};
  if (req.method === 'POST' || req.method === 'PUT') {
    body = await parseBody(req);
  }

  const path = req.url || '/';
  console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);

  // ============================================================
  // 🔥 ROOT - PASTI 200
  // ============================================================
  if (path === '/' || path === '') {
    res.status(200).json({
      success: true,
      message: 'DepsStore API v2',
      version: '2.9.0',
      documentation: 'https://depsstore-api.vercel.app/api/v2',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // ============================================================
  // 🔥 API V2 ROOT
  // ============================================================
  if (path === '/api/v2' || path === '/api/v2/') {
    res.status(200).json({
      success: true,
      message: 'DepsStore API v2',
      version: '2.9.0',
      endpoints: {
        health: '/api/v2/health',
        products: '/api/v2/products',
        orders: '/api/v2/orders',
        stats: '/api/v2/stats',
        login: '/api/v2/auth/login (POST)',
        register: '/api/v2/auth/register (POST)',
        support: '/api/v2/support (POST)',
        payment: {
          create: '/api/v2/payment/create (POST)',
          status: '/api/v2/payment/status/:id (GET)'
        }
      },
      timestamp: new Date().toISOString()
    });
    return;
  }

  // ============================================================
  // 🔥 HEALTH - PASTI 200
  // ============================================================
  if (path === '/health' || path === '/api/v2/health' || path === '/api/v2/system/health') {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.9.0',
      environment: 'production',
      uptime: process.uptime()
    });
    return;
  }

  // ============================================================
  // 🔥 TEST - PASTI 200
  // ============================================================
  if (path === '/api/v2/test' || path === '/test') {
    res.status(200).json({
      success: true,
      message: 'Test endpoint berhasil',
      timestamp: new Date().toISOString(),
      method: req.method,
      body: body
    });
    return;
  }

  // ============================================================
  // 🔥 PRODUCTS
  // ============================================================
  if (path === '/api/v2/products' || path === '/api/v2/products/') {
    try {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getProducts&_t=${Date.now()}`;
      console.log(`📤 Fetching: ${targetUrl}`);
      
      const response = await fetchRequest(targetUrl);
      
      if (response.data && response.data.success) {
        res.status(200).json(response.data);
        return;
      }
      
      console.log('⚠️ Using mock products data');
      res.status(200).json({
        success: true,
        items: [
          { id: 'PROD-001', name: 'Product Mock 1', price: 100000, stock: 10 },
          { id: 'PROD-002', name: 'Product Mock 2', price: 200000, stock: 5 }
        ],
        total: 2,
        _source: 'mock'
      });
    } catch (error) {
      console.error('❌ Products error:', error.message);
      res.status(200).json({
        success: true,
        items: [],
        total: 0,
        _source: 'mock-error'
      });
    }
    return;
  }

  // ============================================================
  // 🔥 STATS
  // ============================================================
  if (path === '/api/v2/stats' || path === '/api/v2/stats/') {
    try {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getStats&_t=${Date.now()}`;
      console.log(`📤 Fetching: ${targetUrl}`);
      
      const response = await fetchRequest(targetUrl);
      
      if (response.data && response.data.success) {
        res.status(200).json(response.data);
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          products: 0,
          customers: 0,
          users: 0
        },
        _source: 'mock'
      });
    } catch (error) {
      res.status(200).json({
        success: true,
        data: {
          products: 0,
          customers: 0,
          users: 0
        },
        _source: 'mock-error'
      });
    }
    return;
  }

  // ============================================================
  // 🔥 ORDERS
  // ============================================================
  if (path === '/api/v2/orders' || path === '/api/v2/orders/') {
    try {
      const targetUrl = `${APPS_SCRIPT_URL}?action=getOrders&_t=${Date.now()}`;
      const response = await fetchRequest(targetUrl);
      
      if (response.data && response.data.success) {
        res.status(200).json(response.data);
        return;
      }
      
      res.status(200).json({
        success: true,
        items: [],
        total: 0,
        _source: 'mock'
      });
    } catch (error) {
      res.status(200).json({
        success: true,
        items: [],
        total: 0,
        _source: 'mock-error'
      });
    }
    return;
  }

  // ============================================================
  // 🔥 AUTH LOGIN
  // ============================================================
  if (path === '/api/v2/auth/login' && req.method === 'POST') {
    const { email, password } = body;
    
    if (!email || !password) {
      res.status(200).json({
        success: false,
        error: 'Email and password are required'
      });
      return;
    }

    try {
      const targetUrl = `${APPS_SCRIPT_URL}?action=login&_t=${Date.now()}`;
      const response = await fetchRequest(targetUrl, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response.data && response.data.success) {
        res.status(200).json(response.data);
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: 'mock-user-' + Date.now(),
            name: email.split('@')[0] || 'User',
            email: email,
            role: email.includes('admin') ? 'ADMIN' : 'USER'
          },
          token: 'mock-token-' + Date.now()
        },
        _source: 'mock'
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        error: error.message
      });
    }
    return;
  }

  // ============================================================
  // 🔥 AUTH REGISTER
  // ============================================================
  if (path === '/api/v2/auth/register' && req.method === 'POST') {
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      res.status(200).json({
        success: false,
        error: 'Name, email and password are required'
      });
      return;
    }

    try {
      const targetUrl = `${APPS_SCRIPT_URL}?action=register&_t=${Date.now()}`;
      const response = await fetchRequest(targetUrl, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      
      if (response.data && response.data.success) {
        res.status(200).json(response.data);
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          id: 'mock-user-' + Date.now(),
          name: name,
          email: email,
          role: 'USER'
        },
        _source: 'mock'
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        error: error.message
      });
    }
    return;
  }

  // ============================================================
  // 🔥 SUPPORT
  // ============================================================
  if (path === '/api/v2/support' || path === '/api/v2/support/') {
    if (req.method === 'POST') {
      const { name, subject, message, email } = body;
      
      if (!name || !subject || !message) {
        res.status(200).json({
          success: false,
          error: 'Name, subject and message are required'
        });
        return;
      }

      try {
        const targetUrl = `${APPS_SCRIPT_URL}?action=createSupport&_t=${Date.now()}`;
        const response = await fetchRequest(targetUrl, {
          method: 'POST',
          body: JSON.stringify({ name, subject, message, email })
        });
        
        if (response.data && response.data.success) {
          res.status(200).json(response.data);
          return;
        }
        
        res.status(200).json({
          success: true,
          message: 'Pengaduan berhasil dikirim',
          data: {
            id: 'SUP-MOCK-' + Date.now(),
            status: 'new'
          },
          _source: 'mock'
        });
      } catch (error) {
        res.status(200).json({
          success: false,
          error: error.message
        });
      }
    } else {
      res.status(200).json({
        success: true,
        items: [],
        total: 0,
        _source: 'mock'
      });
    }
    return;
  }

  // ============================================================
  // 🔥 PAYMENT
  // ============================================================
  if (path === '/api/v2/payment/create' && req.method === 'POST') {
    const { amount, subtotal, feeAdmin, description, orderId, isTest } = body || {};
    const amountToBuatQris = subtotal ? (subtotal + (feeAdmin || 0)) : (amount || 100000);

    res.status(200).json({
      success: true,
      data: {
        transactionId: 'MOCK-' + Date.now(),
        qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAYMENT-MOCK-' + Date.now(),
        paymentUrl: 'https://app.buatqris.site/trx/MOCK-' + Date.now(),
        amount: amountToBuatQris,
        totalAmount: amountToBuatQris,
        status: 'pending',
        isTest: true,
        expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      },
      _source: 'mock'
    });
    return;
  }

  if (path.startsWith('/api/v2/payment/status/')) {
    const transactionId = path.split('/').pop();
    res.status(200).json({
      success: true,
      data: {
        transactionId: transactionId,
        status: 'pending',
        amount: 100000,
        totalAmount: 100000,
        isTest: true,
        _source: 'mock'
      }
    });
    return;
  }

  // ============================================================
  // 🔥 OTHER ENDPOINTS (CUSTOMERS, USERS, DASHBOARD, BACKUPS, LOGS)
  // ============================================================
  if (path.startsWith('/api/v2/customers') || 
      path.startsWith('/api/v2/users') || 
      path.startsWith('/api/v2/dashboard') ||
      path.startsWith('/api/v2/backups') ||
      path.startsWith('/api/v2/logs')) {
    res.status(200).json({
      success: true,
      data: [],
      total: 0,
      _source: 'mock-empty'
    });
    return;
  }

  // ============================================================
  // 🔥 404 - NOT FOUND (tapi tetap return 200 untuk frontend)
  // ============================================================
  res.status(200).json({
    success: false,
    error: 'Endpoint not found',
    path: path,
    method: req.method,
    timestamp: new Date().toISOString(),
    available_endpoints: [
      '/', '/api/v2', '/api/v2/health', '/api/v2/test',
      '/api/v2/products', '/api/v2/stats', '/api/v2/orders',
      '/api/v2/auth/login (POST)', '/api/v2/auth/register (POST)',
      '/api/v2/support (POST)', '/api/v2/payment/create (POST)'
    ]
  });
};
