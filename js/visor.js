// ================= VISOR DE FOTOS DE LA GALERÍA =================
// Sustituye a jQuery + Lightbox. Abre en grande las fotos enlazadas con
// data-lightbox, con flechas, teclado (← → Esc), deslizamiento en el móvil
// y contador. Las fotos del mismo data-lightbox forman un grupo.
(function () {
    const enlaces = Array.from(document.querySelectorAll('a[data-lightbox]'));
    if (!enlaces.length) return;

    // ---------- Estructura del visor ----------
    const visor = document.createElement('div');
    visor.className = 'visor';
    visor.hidden = true;
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');
    visor.setAttribute('aria-label', 'Galería de fotos');
    visor.innerHTML =
        '<button type="button" class="visor-boton visor-cerrar" aria-label="Cerrar"><i class="fas fa-xmark" aria-hidden="true"></i></button>' +
        '<button type="button" class="visor-boton visor-anterior" aria-label="Foto anterior"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>' +
        '<figure class="visor-figura">' +
            '<img class="visor-img" alt="">' +
            '<figcaption class="visor-pie" aria-live="polite"></figcaption>' +
        '</figure>' +
        '<button type="button" class="visor-boton visor-siguiente" aria-label="Foto siguiente"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>';
    document.body.appendChild(visor);

    const img = visor.querySelector('.visor-img');
    const pie = visor.querySelector('.visor-pie');
    const btnCerrar = visor.querySelector('.visor-cerrar');
    const btnAnterior = visor.querySelector('.visor-anterior');
    const btnSiguiente = visor.querySelector('.visor-siguiente');

    let grupo = [];
    let actual = 0;
    let focoAnterior = null;

    function precargar(indice) {
        const enlace = grupo[(indice + grupo.length) % grupo.length];
        if (enlace) new Image().src = enlace.href;
    }

    function mostrar(indice) {
        actual = (indice + grupo.length) % grupo.length;
        const enlace = grupo[actual];
        const miniatura = enlace.querySelector('img');
        const texto = miniatura && miniatura.alt ? miniatura.alt : '';
        img.classList.remove('visible');
        img.onload = function () { img.classList.add('visible'); };
        img.src = enlace.href;
        img.alt = texto;
        // El texto automático "Foto N del viaje a…" no se repite junto al contador
        const automatico = /^Foto \d+ (del|de la) /.test(texto);
        pie.textContent = (texto && !automatico ? texto + ' · ' : '') + (actual + 1) + ' / ' + grupo.length;
        if (grupo.length > 1) {
            precargar(actual + 1);
            precargar(actual - 1);
        }
    }

    function abrir(enlace) {
        grupo = enlaces.filter(function (e) { return e.dataset.lightbox === enlace.dataset.lightbox; });
        const unaSola = grupo.length < 2;
        btnAnterior.hidden = unaSola;
        btnSiguiente.hidden = unaSola;
        focoAnterior = document.activeElement;
        visor.hidden = false;
        document.body.style.overflow = 'hidden';
        mostrar(grupo.indexOf(enlace));
        btnCerrar.focus();
    }

    function cerrar() {
        visor.hidden = true;
        document.body.style.overflow = '';
        img.removeAttribute('src');
        if (focoAnterior) focoAnterior.focus();
    }

    // ---------- Eventos ----------
    enlaces.forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
            e.preventDefault();
            abrir(enlace);
        });
    });

    btnCerrar.addEventListener('click', cerrar);
    btnAnterior.addEventListener('click', function () { mostrar(actual - 1); });
    btnSiguiente.addEventListener('click', function () { mostrar(actual + 1); });

    // Pulsar fuera de la foto cierra el visor
    visor.addEventListener('click', function (e) {
        if (e.target === visor || e.target.classList.contains('visor-figura')) cerrar();
    });

    document.addEventListener('keydown', function (e) {
        if (visor.hidden) return;
        if (e.key === 'Escape') cerrar();
        else if (e.key === 'ArrowLeft' && grupo.length > 1) mostrar(actual - 1);
        else if (e.key === 'ArrowRight' && grupo.length > 1) mostrar(actual + 1);
        else if (e.key === 'Tab') {
            // Mantener el foco dentro del visor
            const botones = Array.from(visor.querySelectorAll('button')).filter(function (b) { return !b.hidden; });
            const i = botones.indexOf(document.activeElement);
            e.preventDefault();
            const siguiente = e.shiftKey ? i - 1 : i + 1;
            botones[(siguiente + botones.length) % botones.length].focus();
        }
    });

    // Deslizar con el dedo en el móvil
    let inicioX = null;
    visor.addEventListener('touchstart', function (e) {
        inicioX = e.touches[0].clientX;
    }, { passive: true });
    visor.addEventListener('touchend', function (e) {
        if (inicioX === null || grupo.length < 2) return;
        const distancia = e.changedTouches[0].clientX - inicioX;
        if (Math.abs(distancia) > 50) mostrar(actual + (distancia < 0 ? 1 : -1));
        inicioX = null;
    });
})();
