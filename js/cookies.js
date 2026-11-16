// ================= AVISO DE COOKIES =================
// Esta web no usa cookies propias. Las únicas cookies las puede instalar Google
// al cargar los mapas de Google Maps, así que los mapas no se cargan hasta que
// el visitante lo acepta. La elección se guarda en el navegador (localStorage).
(function () {
    const CLAVE = 'hv-cookies';            // valores: 'aceptadas' | 'rechazadas'
    // Ruta a la política de cookies relativa a este script (funciona en la raíz,
    // en subcarpetas y en la página 404)
    const POLITICA = new URL('../cookies.html', document.currentScript.src).href;

    function leer() {
        try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
    }

    function guardar(valor) {
        try { localStorage.setItem(CLAVE, valor); } catch (e) { /* sin almacenamiento: se pregunta en cada visita */ }
    }

    // ---------- Mapas de Google bloqueados hasta tener permiso ----------
    const mapas = Array.from(document.querySelectorAll('iframe[data-src]'));

    function cargarMapa(iframe) {
        if (iframe.getAttribute('src')) return;
        iframe.setAttribute('src', iframe.dataset.src);
        iframe.hidden = false;
        const aviso = iframe.previousElementSibling;
        if (aviso && aviso.classList.contains('mapa-aviso')) aviso.remove();
    }

    function cargarTodos() {
        mapas.forEach(cargarMapa);
    }

    mapas.forEach(function (iframe) {
        iframe.hidden = true;
        const aviso = document.createElement('div');
        aviso.className = 'mapa-aviso';
        aviso.innerHTML =
            '<i class="fas fa-map-location-dot" aria-hidden="true"></i>' +
            '<p>Este mapa es de <strong>Google Maps</strong>. Al cargarlo, Google puede instalar cookies en tu navegador.</p>' +
            '<div class="mapa-aviso-botones">' +
                '<button type="button" class="cookies-btn principal" data-accion="uno">Cargar este mapa</button>' +
                '<button type="button" class="cookies-btn secundario" data-accion="todos">Aceptar cookies y cargar todos</button>' +
            '</div>' +
            '<a href="' + POLITICA + '">Política de cookies</a>';
        aviso.addEventListener('click', function (e) {
            const boton = e.target.closest('button');
            if (!boton) return;
            if (boton.dataset.accion === 'uno') {
                cargarMapa(iframe);
            } else {
                elegir('aceptadas');
            }
        });
        iframe.parentNode.insertBefore(aviso, iframe);
    });

    // ---------- Aviso (banner) ----------
    const banner = document.createElement('div');
    banner.className = 'cookies-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.hidden = true;
    banner.innerHTML =
        '<p><strong>🍪 Cookies</strong> Esta web no usa cookies propias. Solo los mapas de Google Maps pueden instalar cookies de Google, y no se cargan hasta que lo aceptes. ' +
        '<a href="' + POLITICA + '">Más información</a></p>' +
        '<div class="cookies-botones">' +
            '<button type="button" class="cookies-btn secundario" data-cookies="rechazadas">Rechazar</button>' +
            '<button type="button" class="cookies-btn principal" data-cookies="aceptadas">Aceptar</button>' +
        '</div>';
    document.body.appendChild(banner);

    function elegir(valor) {
        const antes = leer();
        guardar(valor);
        banner.hidden = true;
        if (valor === 'aceptadas') {
            cargarTodos();
        } else if (antes === 'aceptadas') {
            // Si antes había aceptado, se recarga para quitar los mapas ya cargados
            location.reload();
        }
    }

    banner.addEventListener('click', function (e) {
        const boton = e.target.closest('button[data-cookies]');
        if (boton) elegir(boton.dataset.cookies);
    });

    // Botones "Configurar cookies" (pie de página y política de cookies)
    document.addEventListener('click', function (e) {
        if (e.target.closest('.abrir-cookies')) {
            e.preventDefault();
            banner.hidden = false;
            banner.querySelector('button').focus();
        }
    });

    // ---------- Estado inicial ----------
    const estado = leer();
    if (estado === 'aceptadas') {
        cargarTodos();
    } else if (estado !== 'rechazadas') {
        banner.hidden = false;
    }
})();
