/**
 * products.js - Fungsi untuk mengelola produk dari API
 * @version 2.9.0
 */

// 🔥 PAKAI DARI CONFIG
var API_URL = window.API_URL || 'http://localhost:3000';

function loadProducts() {
    var grid = document.getElementById('productGrid');
    if (!grid) {
        console.warn('Elemen productGrid tidak ditemukan');
        return;
    }

    var url = API_URL + '/api/v2/products?limit=8';
    console.log('📡 Fetching products from:', url);

    fetch(url)
        .then(function(res) {
            console.log('📡 Response status:', res.status);
            if (!res.ok) {
                return res.text().then(function(text) {
                    throw new Error('HTTP ' + res.status + ': ' + text.substring(0, 200));
                });
            }
            return res.json();
        })
        .then(function(data) {
            console.log('📦 Products data:', data);
            if (data.success && data.items) {
                renderProduk(data.items);
                var total = data.pagination ? data.pagination.total : data.items.length;
                var statEl = document.getElementById('statProducts');
                if (statEl) statEl.textContent = total || 0;
            } else if (data.success && data.data) {
                // 🔥 Jika data dalam format { success: true, data: [...] }
                renderProduk(data.data);
                var statEl = document.getElementById('statProducts');
                if (statEl) statEl.textContent = data.data.length || 0;
            } else {
                grid.innerHTML = '<div class="text-center col-span-full py-10 text-blue-400/60">' +
                    (data.error || 'Tidak ada produk ditemukan') + '</div>';
            }
        })
        .catch(function(err) {
            console.error('❌ Gagal memuat produk:', err);
            grid.innerHTML = '<div class="text-center col-span-full py-10 text-red-400/60">' +
                '❌ Gagal memuat produk: ' + err.message +
                '<br><span class="text-xs text-blue-400/40 mt-2 block">' +
                'Pastikan server backend berjalan (node proxy.js atau node main.js)' +
                '</span></div>';
        });
}


// ============================================================
// MENAMPILKAN PRODUK
// ============================================================

function renderProduk(products) {
    var grid = document.getElementById('productGrid');
    if (!grid) return;

    var icons = ['fa-clock', 'fa-glasses', 'fa-shoe-prints', 'fa-mug-hot', 'fa-ring', 'fa-bag', 'fa-wallet', 'fa-clock'];
    var html = '';

    if (!products || products.length === 0) {
        grid.innerHTML = '<div class="text-center col-span-full py-10 text-blue-400/60">Tidak ada produk tersedia</div>';
        return;
    }

    products.forEach(function(product, index) {
        var harga = 'Rp ' + (product.price || 0).toLocaleString('id-ID');

        var badge = '';
        if (product.stock < 5 && product.stock > 0) {
            badge = '<div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 badge-promo" style="background:linear-gradient(135deg,#dc2626,#ef4444);"><i class="fas fa-exclamation text-[6px] sm:text-[8px] mr-0.5 sm:mr-1"></i> STOK TERBATAS</div>';
        } else if (product.stock < 1) {
            badge = '<div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 badge-promo" style="background:linear-gradient(135deg,#6b7280,#9ca3af);"><i class="fas fa-times text-[6px] sm:text-[8px] mr-0.5 sm:mr-1"></i> HABIS</div>';
        } else if (index < 2) {
            badge = '<div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 badge-promo"><i class="fas fa-bolt text-[6px] sm:text-[8px] mr-0.5 sm:mr-1"></i> HOT</div>';
        } else if (product.category_code === '001' || product.category === 'Elektronik') {
            badge = '<div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 badge-promo" style="background:linear-gradient(135deg,#7c3aed,#8b5cf6);"><i class="fas fa-gem text-[6px] sm:text-[8px] mr-0.5 sm:mr-1"></i> PREMIUM</div>';
        }

        html += '<div class="product-card relative">';
        html += badge;
        html += '<div class="product-image-container">';

        var imageUrl = product.image || '';
        html += '<img src="' + imageUrl + '" alt="' + (product.name || 'Product') + '" class="product-image" onerror="this.classList.add(\'error\')" />';
        html += '<div class="image-fallback"><i class="fas ' + icons[index % icons.length] + '"></i><span class="fallback-label">gambar tidak tersedia</span></div>';
        html += '</div>';
        html += '<div class="product-info">';
        html += '<h3 class="product-title">' + (product.name || 'Tanpa Nama') + '</h3>';
        html += '<p class="product-desc">' + (product.category || 'Umum') + ' · ' + (product.stock || 0) + ' tersisa</p>';
        html += '<div class="product-bottom">';
        html += '<span class="product-price">' + harga + '</span>';

        var disabled = product.stock < 1 ? ' disabled' : '';
        var onclick = product.stock > 0 ? 'onclick="tambahKeKeranjang(\'' + product.id + '\', \'' + (product.name || 'Produk').replace(/'/g, "\\'") + '\', ' + (product.price || 0) + ')"' : '';
        html += '<button class="add-btn' + disabled + '" ' + onclick + '>';
        html += '<i class="fas fa-plus"></i> ' + (product.stock > 0 ? 'Tambah' : 'Habis');
        html += '</button>';
        html += '</div></div></div>';
    });

    grid.innerHTML = html;
}

// ============================================================
// TAMBAH KE KERANJANG (localStorage)
// ============================================================

function tambahKeKeranjang(id, nama, harga) {
    if (!id) {
        console.error('ID produk tidak valid');
        return;
    }

    var keranjang = JSON.parse(localStorage.getItem('depsstore_cart') || '[]');
    var existing = keranjang.find(function(item) {
        return item.id === id;
    });

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        keranjang.push({
            id: id,
            name: nama || 'Produk',
            price: harga || 0,
            quantity: 1
        });
    }

    localStorage.setItem('depsstore_cart', JSON.stringify(keranjang));

    // 🔥 Tampilkan notifikasi
    alert('✅ ' + (nama || 'Produk') + ' ditambahkan ke keranjang!');
}

// ============================================================
// EKSPOS FUNGSI KE GLOBAL
// ============================================================

window.loadProducts = loadProducts;
window.tambahKeKeranjang = tambahKeKeranjang;