/**
 * server/config.js
 * Configuration untuk backend lokal
 * @version 2.9.0
 */

export const config = {
    // Server
    env: 'development',
    port: 3000,

    // Apps Script - GANTI DENGAN URL DEPLOY ANDA
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbw1ZgXJUaQ-U0RVeaNIdhszUvexE4IjUFmGaxI_QCPOSg55uQRFtrCCEbrOl8KvsftV/exec',
    appsScriptTimeout: 30000,

    // JWT
    jwtSecret: 'depsstore-secret-key-change-me',
    jwtExpiry: 7200,

    // Cache
    cacheTTL: 300,

    // Logging
    logLevel: 'info'
};