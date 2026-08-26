/**
 * api/index.js - Vercel Serverless Function
 * @version 2.9.0
 */

// 🔥 PAKAI const UNTUK SATU KALI DEKLARASI
const https = require('https');
const http = require('http');
const url = require('url');

// 🔥 APPS SCRIPT URL - HANYA SATU DEKLARASI
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec';

// 🔥 MOCK DATA
const MOCK_PRODUCTS = {
  success: true,
  items: [
    {
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

// ============================================================
// VERCELL SERVERLESS HANDLER
// ============================================================

module.exports = async (req, res) => {
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

  try {
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
          register: '/api/v2/auth/register'
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
        
        res.status(200).json({
          success: true,
          message: 'Apps Script Connection Test',
          appsScript: {
            url: APPS_SCRIPT_URL,
            status: response.status,
            contentType: response.headers['content-type'],
            preview: response.data ? response.data.substring(0, 300) : 'No data'
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(200).json({
          success: false,
          error: 'Cannot connect to Apps Script',
          message: error.message
        });
      }
      return;
    }

    // ============================================================
    // PRODUCTS
    // ============================================================
    if (path.startsWith('/api/v2/products') || path.startsWith('/api/v2/produk')) {
      try {
        const targetUrl = APPS_SCRIPT_URL + path;
        console.log(`  → Fetching: ${targetUrl}`);
        
        const response = await fetchRequest(targetUrl);
        
        try {
          const jsonData = JSON.parse(response.data);
          res.status(response.status || 200).json(jsonData);
        } catch (e) {
          console.log('  ⚠️ Invalid JSON, using mock data');
          res.status(200).json(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.log('  ❌ Error, using mock data');
        res.status(200).json(MOCK_PRODUCTS);
      }
      return;
    }

    // ============================================================
    // AUTH
    // ============================================================
    if (path.startsWith('/api/v2/auth/')) {
      try {
        const targetUrl = APPS_SCRIPT_URL + path;
        console.log(`  → Auth proxy to: ${targetUrl}`);
        
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
          res.status(500).json({
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
          register: '/api/v2/auth/register'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    // ============================================================
    // 404
    // ============================================================
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
