/**
 * sidebar.js - Fungsi untuk mengontrol sidebar mobile frontend
 * @version 2.9.0
 */

(function() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var openBtn = document.getElementById('openSidebarBtn');
    var closeBtn = document.getElementById('closeSidebarBtn');

    function bukaSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function tutupSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openBtn) {
        openBtn.addEventListener('click', bukaSidebar);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', tutupSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', tutupSidebar);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            tutupSidebar();
        }
    });

    var sidebarLinks = sidebar.querySelectorAll('nav a');
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', tutupSidebar);
    });

    var sidebarCtaBtn = sidebar.querySelector('.sidebar-cta button');
    if (sidebarCtaBtn) {
        sidebarCtaBtn.addEventListener('click', tutupSidebar);
    }
})();