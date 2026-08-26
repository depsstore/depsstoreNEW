// api/index.js - Vercel Serverless Function
const https = require('https');
const http = require('http');
const url = require('url');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec';

const MOCK_PRODUCTS = { ... }; // (Kode awal tetap)

function fetchRequest(targetUrl, options = {}) { ... } // (Kode awal tetap)

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

  // ============================================================
  // 🔥🔥🔥 TAMBAHAN BARU: ROOT & API V2 ROOT - PASTI 200
  // ============================================================
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

  // ============================================================
  // 🔥 TAMBAHAN BARU: HEALTH CHECK - PASTI 200
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

  // 🔥 PRODUCTS
  if (path.startsWith('/api/v2/products')) {
    res.status(200).json({
      success: true,
      items: [],
      total: 0,
      _source: 'mock-empty'
    });
    return;
  }

  // 🔥 ORDERS
  if (path.startsWith('/api/v2/orders')) {
    res.status(200).json({
      success: true,
      items: [],
      total: 0,
      _source: 'mock-empty'
    });
    return;
  }

  // 🔥 STATS
  if (path.startsWith('/api/v2/stats')) {
    res.status(200).json({
      success: true,
      data: {
        products: 0,
        customers: 0,
        users: 0
      },
      _source: 'mock-empty'
    });
    return;
  }

  // 🔥 AUTH LOGIN
  if (path === '/api/v2/auth/login' && req.method === 'POST') {
    res.status(200).json({
      success: true,
      data: {
        user: { id: 'mock-user', name: 'Admin', email: 'admin@depsstore.com', role: 'ADMIN' },
        token: 'mock-token-' + Date.now()
      }
    });
    return;
  }

  // 🔥 AUTH REGISTER
  if (path === '/api/v2/auth/register' && req.method === 'POST') {
    res.status(200).json({
      success: true,
      data: {
        id: 'mock-user-' + Date.now(),
        name: req.body.name || 'User',
        email: req.body.email || 'user@depsstore.com',
        role: 'USER'
      }
    });
    return;
  }

  // 🔥 SUPPORT
  if (path.startsWith('/api/v2/support')) {
    res.status(200).json({
      success: true,
      message: 'Pengaduan berhasil dikirim',
      data: {
        id: 'SUP-MOCK-' + Date.now(),
        status: 'new'
      }
    });
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

  // 🔥 404
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: path,
    method: req.method
  });
};
