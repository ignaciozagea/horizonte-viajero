 // ================= MENÚ HAMBURGUESA (abre desde IZQUIERDA) =================
    (function() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const overlay = document.getElementById('overlay');
        const body = document.body;
        let menuOpen = false;

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

        hamburger.addEventListener('click', () => {
            if (menuOpen) closeMenu();
            else openMenu();
        });

        overlay.addEventListener('click', closeMenu);

        // Cerrar menú al hacer clic en un enlace
        const allLinks = document.querySelectorAll('.nav-links a');
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 968) {
                    closeMenu();
                }
            });
        });

        // Cerrar menú al redimensionar a escritorio
        window.addEventListener('resize', () => {
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