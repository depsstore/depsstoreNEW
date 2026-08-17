// src/frontend/ui/js/config.js

var isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// 🔥 GANTI DENGAN URL VERCEL ANDA (tanpa slash di akhir)
var PRODUCTION_API_URL = 'https://depsstore-seven.vercel.app'; // HAPUS slash di akhir!

var API_URL = isProduction ? PRODUCTION_API_URL : 'http://localhost:3000';

console.log('🌍 Environment:', isProduction ? 'Production' : 'Development');
console.log('🔗 API URL:', API_URL);

window.IS_PRODUCTION = isProduction;
window.API_URL = API_URL;