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

    // ================= SECCIÓN ACTIVA EN EL MENÚ =================
    // Resalta en el menú la sección que se está leyendo
    (function() {
        const enlaces = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
        const secciones = enlaces
            .map(a => document.getElementById(a.getAttribute('href').slice(1)))
            .filter(Boolean);
        if (!secciones.length) return;

        function marcar() {
            const linea = window.scrollY + 140;
            // La sección más cercana por encima de la línea de lectura
            // (no se asume que el orden del menú sea el de la página)
            let actual = null, mejor = -Infinity;
            secciones.forEach(s => {
                const top = s.getBoundingClientRect().top + window.scrollY;
                if (top <= linea && top > mejor) { mejor = top; actual = s; }
            });
            enlaces.forEach(a => {
                a.classList.toggle('activo', !!actual && a.getAttribute('href') === '#' + actual.id);
            });
        }

        window.addEventListener('scroll', marcar, { passive: true });
        window.addEventListener('load', marcar);
    })();
