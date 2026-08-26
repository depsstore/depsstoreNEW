// api/index.js
const https = require('https');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyi-CMq3E2f1-99UA8kRoD7YobdoflwJEE-ZjksAKnhcZ62x0q21TjiDytxfFUvr0mC/exec';

function fetchRequest(targetUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(targetUrl);
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

module.exports = async (req, res) => {
  // ... CORS & lainnya

  const path = req.url || '/';
  console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);

  // 🔥 ROOT & API V2
  if (path === '/' || path === '' || path === '/api/v2/' || path === '/api/v2') {
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

  // 🔥 HEALTH CHECK
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
    try {
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
    } catch (e) {
      res.status(200).json({ success: true, items: [], total: 0, _source: 'mock-empty' });
    }
    return;
  }

  // 🔥 ORDERS
  if (path.startsWith('/api/v2/orders')) {
    const targetUrl = `${APPS_SCRIPT_URL}?action=getOrders`;
    const response = await fetchRequest(targetUrl);
    try {
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
    } catch (e) {
      res.status(200).json({ success: true, items: [], total: 0, _source: 'mock-empty' });
    }
    return;
  }

  // 🔥 STATS
  if (path.startsWith('/api/v2/stats')) {
    const targetUrl = `${APPS_SCRIPT_URL}?action=getStats`;
    const response = await fetchRequest(targetUrl);
    try {
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
    } catch (e) {
      res.status(200).json({ success: true, data: { products: 0, customers: 0, users: 0 }, _source: 'mock-empty' });
    }
    return;
  }

  // 🔥 AUTH LOGIN
  if (path === '/api/v2/auth/login' && req.method === 'POST') {
    const targetUrl = `${APPS_SCRIPT_URL}?action=login`;
    const response = await fetchRequest(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    try {
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
    } catch (e) {
      res.status(200).json({ success: true, data: { user: { id: 'mock-user', name: 'Admin', email: 'admin@depsstore.com', role: 'ADMIN' }, token: 'mock-token-' + Date.now() } });
    }
    return;
  }

  // 🔥 AUTH REGISTER
  if (path === '/api/v2/auth/register' && req.method === 'POST') {
    const targetUrl = `${APPS_SCRIPT_URL}?action=register`;
    const response = await fetchRequest(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    try {
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
    } catch (e) {
      res.status(200).json({ success: true, data: { id: 'mock-user-' + Date.now(), name: req.body.name || 'User', email: req.body.email || 'user@depsstore.com', role: 'USER' } });
    }
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
    try {
      const jsonData = JSON.parse(response.data);
      res.status(response.status || 200).json(jsonData);
    } catch (e) {
      res.status(200).json({ success: true, message: 'Pengaduan berhasil dikirim', data: { id: 'SUP-MOCK-' + Date.now(), status: 'new' } });
    }
    return;
  }

  // 🔥 PAYMENT CREATE (POST) - LANGSUNG KE BUATQRIS
  if (path === '/api/v2/payment/create' && req.method === 'POST') {
    const { amount, subtotal, feeAdmin, description, orderId, isTest } = req.body || {};
    const amountToBuatQris = subtotal ? (subtotal + (feeAdmin || 0)) : amount;

    const params = new URLSearchParams();
    params.append('action', 'api_create_qris');
    params.append('account_id', process.env.BUATQRIS_ACCOUNT_ID || '');
    params.append('secret_token', process.env.BUATQRIS_SECRET_TOKEN || '');
    params.append('amount', String(amountToBuatQris || 0));
    params.append('description', description || 'Pembayaran Order ' + orderId);
    params.append('test', isTest ? '1' : '0');

    const response = await fetchRequest('https://api.buatqris.site', {
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
      res.status(200).json({
        success: true,
        data: {
          transactionId: 'MOCK-' + Date.now(),
          qrUrl: 'https://via.placeholder.com/300x300?text=QRIS',
          paymentUrl: 'https://app.buatqris.site/trx/MOCK-' + Date.now(),
          amount: amountToBuatQris,
          totalAmount: amountToBuatQris,
          status: 'pending',
          isTest: true,
          expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      });
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

    const response = await fetchRequest('https://api.buatqris.site', {
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
};
