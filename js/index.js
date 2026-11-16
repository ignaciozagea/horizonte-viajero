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
                            if (otherSubmenu) otherSubmenu.style.display = '';
                        }
                    });
                    
                    // Solo se cambia la clase: el CSS decide cómo se muestra (dos columnas)
                    parent.classList.toggle('active');
                    if (submenu) submenu.style.display = '';
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

    // ================= BUSCADOR Y FILTROS DE DESTINOS =================
    (function () {
        const input = document.getElementById('buscar-destino');
        if (!input) return;
        const botones = document.querySelectorAll('.buscador-filtros .filtro');
        const resultado = document.querySelector('.buscador-resultado');
        const secciones = document.querySelectorAll('.guias');
        let filtro = 'todos';

        // Minúsculas y sin acentos: "Japón" y "japon" son lo mismo
        const normalizar = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

        function aplicar() {
            const palabras = normalizar(input.value).split(/\s+/).filter(Boolean);
            const encontradas = new Set();   // un destino puede salir en varias secciones

            secciones.forEach(seccion => {
                let visibles = 0;
                seccion.querySelectorAll('.card-guia').forEach(tarjeta => {
                    const texto = tarjeta.dataset.buscar || '';
                    const tipos = (tarjeta.dataset.tipos || '').split(' ');
                    const pasaFiltro = filtro === 'todos' || tarjeta.dataset.continente === filtro || tipos.includes(filtro);
                    const pasaTexto = palabras.every(p => texto.includes(p));
                    const ver = pasaFiltro && pasaTexto;
                    tarjeta.hidden = !ver;
                    if (ver) {
                        visibles++;
                        encontradas.add(tarjeta.getAttribute('href'));
                    }
                });
                seccion.hidden = visibles === 0;
            });

            const buscando = palabras.length > 0 || filtro !== 'todos';
            if (!buscando) {
                resultado.textContent = '';
            } else if (encontradas.size === 0) {
                resultado.textContent = 'No hay guías que coincidan. Prueba con otro destino o quita el filtro.';
            } else {
                resultado.textContent = encontradas.size === 1 ? '1 guía encontrada' : encontradas.size + ' guías encontradas';
            }
        }

        input.addEventListener('input', aplicar);

        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                filtro = boton.dataset.filtro;
                botones.forEach(b => {
                    const activo = b === boton;
                    b.classList.toggle('activo', activo);
                    b.setAttribute('aria-pressed', activo);
                });
                aplicar();
            });
        });
    })();
