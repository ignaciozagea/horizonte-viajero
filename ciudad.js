// ================= MENÚ HAMBURGUESA - SCRIPT EXTERNO =================

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const body = document.querySelector('body');
        
        if (!hamburger || !navLinks) return;
        
        let overlay = document.querySelector('.menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            body.appendChild(overlay);
        }
        
        let isMobile = window.innerWidth <= 768;
        let menuOpen = false;
        
        window.addEventListener('resize', function() {
            isMobile = window.innerWidth <= 768;
            if (!isMobile && menuOpen) {
                closeMenu();
            }
        });
        
        function openMenu() {
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
            menuOpen = true;
        }
        
        function closeMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            menuOpen = false;
        }
        
        function toggleMenu() {
            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        
        const allLinks = document.querySelectorAll('.nav-links a');
        allLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && menuOpen) {
                closeMenu();
            }
        });
        
    });
})();

// NOTA: Logo siempre visible (sin función de scroll)