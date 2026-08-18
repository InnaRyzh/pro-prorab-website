/* Pro Prorab — new homepage prototype: interactions */
(function () {
    'use strict';

    /* Header: solid on scroll */
    const header = document.getElementById('siteHeader');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Mobile menu */
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    const setMenu = (open) => {
        burger.classList.toggle('is-open', open);
        menu.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

    /* Smooth anchor scroll with header offset */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = id === '#top' ? 0 : (header.offsetHeight - 1);
            const y = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        });
    });

    /* Reveal on scroll */
    const revealEls = document.querySelectorAll('.reveal');
    // Anything already inside the first viewport shows immediately (no wait for the observer,
    // which does not fire while the tab is hidden, e.g. opened in a background tab).
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < vh * 0.98) el.classList.add('is-in');
    });
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-in'));
    }

    /* Lightbox fed by the existing gallery manifest */
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImage');
    const lbTitle = document.getElementById('lbTitle');
    const lbCounter = document.getElementById('lbCounter');
    let manifest = null;
    let images = [];
    let index = 0;
    let currentName = '';

    const loadManifest = () => manifest
        ? Promise.resolve(manifest)
        : fetch('/images/portfolio/gallery-manifest.json')
            .then(r => r.json())
            .then(data => (manifest = data));

    const show = (i) => {
        if (!images.length) return;
        index = (i + images.length) % images.length;
        const src = images[index];
        lbImg.src = src.startsWith('/') ? src : '/' + src;
        lbImg.alt = currentName + ' — фото ' + (index + 1);
        lbCounter.textContent = (index + 1) + ' / ' + images.length;
        // preload neighbours
        [index + 1, index - 1].forEach(n => {
            const s = images[(n + images.length) % images.length];
            const im = new Image(); im.src = s.startsWith('/') ? s : '/' + s;
        });
    };

    const openLightbox = (key, name) => {
        loadManifest().then(m => {
            images = m[key] || [];
            if (!images.length) return;
            currentName = name;
            lbTitle.textContent = name;
            show(0);
            lb.classList.add('is-open');
            lb.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }).catch(() => { window.location.href = '/#portfolio'; });
    };

    const closeLightbox = () => {
        lb.classList.remove('is-open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lbImg.src = '';
    };

    document.querySelectorAll('.tile[data-gallery]').forEach(tile => {
        tile.addEventListener('click', () => openLightbox(tile.dataset.gallery, tile.dataset.name || ''));
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('role', 'button');
        tile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tile.click(); }
        });
    });
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', () => show(index - 1));
    document.getElementById('lbNext').addEventListener('click', () => show(index + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') show(index + 1);
        if (e.key === 'ArrowLeft') show(index - 1);
    });
    // basic swipe
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
        touchX = null;
    });

    /* Lead form: no backend yet — compose an email with the request */
    const form = document.getElementById('leadForm');
    const success = document.getElementById('formSuccess');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const phone = form.phone.value.trim();
        if (!name || !phone) {
            (!name ? form.name : form.phone).focus();
            return;
        }
        const area = form.area.value.trim();
        const service = form.service.value;
        const subject = encodeURIComponent('Заявка з сайту Pro Prorab');
        const body = encodeURIComponent(
            'Ім\'я: ' + name + '\n' +
            'Телефон: ' + phone + '\n' +
            (area ? 'Площа: ' + area + ' м²\n' : '') +
            'Послуга: ' + service + '\n'
        );
        window.location.href = 'mailto:Natali_shokodko@ukr.net?subject=' + subject + '&body=' + body;
        success.classList.add('is-visible');
    });
})();
