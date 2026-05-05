 // ================= MENÚ HAMBURGUESA (abre desde IZQUIERDA) =================
    (function() {
        const hamburger = document.querySelector('.hamburger');
        const menu = document.querySelector('.menu');
        const body = document.querySelector('body');
        
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        body.appendChild(overlay);
        
        let isMobile = window.innerWidth <= 968;
        let menuOpen = false;
        
        window.addEventListener('resize', function() {
            isMobile = window.innerWidth <= 968;
            if (!isMobile && menuOpen) {
                closeMenu();
            }
        });
        
        function openMenu() {
            hamburger.classList.add('active');
            menu.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
            menuOpen = true;
        }
        
        function closeMenu() {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            menuOpen = false;
            
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
                const submenu = dropdown.querySelector('.submenu');
                if (submenu) submenu.style.display = '';
            });
        }
        
        hamburger.addEventListener('click', function() {
            if (menuOpen) closeMenu();
            else openMenu();
        });
        
        overlay.addEventListener('click', closeMenu);
        
        const cityLinks = document.querySelectorAll('.submenu a');
        cityLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        const mainLinks = document.querySelectorAll('.dropdown > a');
        mainLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 968) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const parent = this.parentElement;
                    const submenu = parent.querySelector('.submenu');
                    
                    document.querySelectorAll('.dropdown').forEach(dropdown => {
                        if (dropdown !== parent && dropdown.classList.contains('active')) {
                            dropdown.classList.remove('active');
                            const otherSubmenu = dropdown.querySelector('.submenu');
                            if (otherSubmenu) otherSubmenu.style.display = 'none';
                        }
                    });
                    
                    parent.classList.toggle('active');
                    if (submenu.style.display === 'block') {
                        submenu.style.display = 'none';
                    } else {
                        submenu.style.display = 'block';
                    }
                }
            });
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 968 && menuOpen) {
                closeMenu();
            }
        });
    })();

    // ================= EFECTO SCROLL =================
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });