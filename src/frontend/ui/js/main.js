/**
 * main.js - Inisialisasi utama frontend
 * @version 2.9.0
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DepsStore Frontend siap digunakan');

    if (document.getElementById('productGrid')) {
        loadProducts();
    }

    console.log('Versi: 2.9.0');
});