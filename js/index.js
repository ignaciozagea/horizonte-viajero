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


    // ================= MAPA DE VIAJES =================
    (function () {
        const svg = document.querySelector('.mapa-svg');
        if (!svg) return;
        const lienzo = svg.parentElement;
        const etiqueta = lienzo.querySelector('.mapa-etiqueta');
        const puntos = Array.from(svg.querySelectorAll('.mapa-punto'));
        const botones = document.querySelectorAll('.mapa-zonas .filtro');

        // Zonas del mapa: [x, y, ancho, alto] en las coordenadas del SVG (1000 x 392)
        const zonas = {
            mundo: [0, 0, 1000, 392],
            europa: [355, 24, 347, 136],
            america: [119, 90, 247, 97],
            asia: [574, 100, 426, 167],
        };
        const RADIO = 4.5;
        let vista = zonas.mundo.slice();
        let tactil = false;
        let activo = null;

        function aplicarVista(v) {
            svg.setAttribute('viewBox', v.map(n => n.toFixed(2)).join(' '));
            // Los puntos mantienen un tamaño cómodo al acercar (algo más grandes en las zonas)
            const k = v[2] / 1000;
            // Mínimo de 5 px en pantalla, para que en el móvil se puedan tocar con el dedo
            const unidadesPorPx = v[2] / (svg.getBoundingClientRect().width || 1000);
            const r = Math.max(RADIO * k * (k < 1 ? 1.6 : 1), 5 * unidadesPorPx);
            puntos.forEach(p => p.firstElementChild.setAttribute('r', r.toFixed(2)));
        }

        function irA(nombre) {
            ocultar();
            const destino = zonas[nombre];
            const inicio = vista.slice();
            const duracion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600;
            const t0 = performance.now();
            function paso(t) {
                const p = duracion ? Math.min(1, (t - t0) / duracion) : 1;
                const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;   // suavizado
                vista = inicio.map((v, i) => v + (destino[i] - v) * e);
                aplicarVista(vista);
                if (p < 1) requestAnimationFrame(paso);
            }
            requestAnimationFrame(paso);
        }

        function mostrar(punto) {
            const c = punto.firstElementChild.getBoundingClientRect();
            const l = lienzo.getBoundingClientRect();
            etiqueta.textContent = punto.dataset.nombre + (tactil ? ' · toca otra vez para abrir' : '');
            const x = Math.min(Math.max(c.left + c.width / 2 - l.left, 70), l.width - 70);
            const y = c.top - l.top;
            etiqueta.classList.toggle('abajo', y < 50);
            etiqueta.style.left = x + 'px';
            etiqueta.style.top = (y < 50 ? c.bottom - l.top : y) + 'px';
            etiqueta.hidden = false;
            activo = punto;
        }

        function ocultar() {
            etiqueta.hidden = true;
            activo = null;
        }

        puntos.forEach(punto => {
            punto.addEventListener('pointerdown', e => { tactil = e.pointerType === 'touch'; });
            punto.addEventListener('mouseenter', () => { if (!tactil) mostrar(punto); });
            punto.addEventListener('mouseleave', () => { if (!tactil) ocultar(); });
            punto.addEventListener('focus', () => { if (!tactil) mostrar(punto); });
            punto.addEventListener('blur', ocultar);
            // En el móvil: el primer toque enseña el nombre y el segundo abre la guía
            punto.addEventListener('click', e => {
                if (tactil && activo !== punto) {
                    e.preventDefault();
                    mostrar(punto);
                }
            });
        });

        lienzo.addEventListener('pointerdown', e => {
            if (!e.target.closest('.mapa-punto')) ocultar();
        });

        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                botones.forEach(b => {
                    const activoBoton = b === boton;
                    b.classList.toggle('activo', activoBoton);
                    b.setAttribute('aria-pressed', activoBoton);
                });
                irA(boton.dataset.zona);
            });
        });

        window.addEventListener('resize', () => { ocultar(); aplicarVista(vista); });
        aplicarVista(vista);
    })();
