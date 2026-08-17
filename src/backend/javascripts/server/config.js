/**
 * server/config.js
 * Configuration untuk backend lokal
 * @version 2.9.0
 */

export const config = {
    // Server
    env: 'development',


    // Apps Script - GANTI DENGAN URL DEPLOY ANDA
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbz7PscckTNRF6nvp7Rrsi21luQJu67pt8Yq4lITtLDxvL_3n8Nlwoxuto-0jPQ2ATGV/exec',
    appsScriptTimeout: 30000,

    // JWT
    jwtSecret: 'depsstore-secret-key-change-me',
    jwtExpiry: 7200,

    // Cache
    cacheTTL: 300,

    // Logging
    logLevel: 'info'
};