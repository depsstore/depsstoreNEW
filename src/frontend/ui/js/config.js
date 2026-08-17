/**
 * config.js - Environment configuration
 * @version 2.9.0
 */

// Cek environment
var isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// 🔥 GANTI DENGAN URL VERCEL ANDA
var PRODUCTION_API_URL = 'https://depsstore-api.vercel.app'; // Ganti dengan URL Vercel Anda

var API_URL = isProduction ?
    PRODUCTION_API_URL // https://depsstore-api.vercel.app
    :
    'http://localhost:3000'; // localhost

var APP_URL = isProduction ?
    'https://depsstore.vercel.app' // Ganti dengan URL GitHub Pages Anda
    :
    'http://localhost:5500';

console.log('🌍 Environment:', isProduction ? 'Production' : 'Development');
console.log('🔗 API URL:', API_URL);

// Ekspos ke global
window.IS_PRODUCTION = isProduction;
window.API_URL = API_URL;
window.APP_URL = APP_URL;