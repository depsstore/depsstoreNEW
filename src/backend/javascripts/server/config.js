/**
 * server/config.js
 * Configuration untuk backend lokal
 * @version 2.9.0
 */

export const config = {
    // Server
    env: 'development',


    // Apps Script - GANTI DENGAN URL DEPLOY ANDA
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxgbn6S0sKU4Z46kCdPrPTgmsRYvsloN30lytZHNSWaFRGev4oqzVvXnKODWAKgDbW0/exec',
    appsScriptTimeout: 30000,

    // JWT
    jwtSecret: 'depsstore-secret-key-change-me',
    jwtExpiry: 7200,

    // Cache
    cacheTTL: 300,

    // Logging
    logLevel: 'info'
};