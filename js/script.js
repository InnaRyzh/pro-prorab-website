// script.js - Основной JavaScript файл для сайта Pro Prorab
// Содержит всю интерактивность сайта

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Pro Prorab сайт завантажено!');

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const root = document.documentElement;
    const headerEl = document.querySelector('.header');

    // Set CSS var for header height to align mobile overlay
    function setHeaderHeightVar() {
        const hh = headerEl ? headerEl.offsetHeight : 64;
        root.style.setProperty('--header-h', hh + 'px');
    }
    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            // Prevent body scroll when menu open
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                document.body.style.overflow = '';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close mobile menu on link click
    if (nav) {
        nav.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn && mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth scrolling for anchor links (handles modal + mobile menu states)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    function smoothScrollTo(targetId) {
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();

            // If modal is open, close it first and then scroll
            const modal = document.getElementById('serviceModal');
            const isModalOpen = modal && modal.getAttribute('aria-hidden') === 'false';
            if (isModalOpen) {
                // Close modal before scrolling
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                setTimeout(() => smoothScrollTo(href), 30);
                return;
            }

            // If mobile nav is open, close it before scrolling
            const nav = document.querySelector('.nav');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuBtn && menuBtn.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => smoothScrollTo(href), 10);
                return;
            }

            smoothScrollTo(href);
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Contact form handling
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');

            // Basic validation
            if (!name || !phone) {
                showNotification('Будь ласка, заповніть всі поля', 'error');
                return;
            }

            // Phone validation (Ukrainian format)
            const phoneRegex = /^(\+38|38|8)?[\s\-]?\(?0\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Будь ласка, введіть коректний номер телефону', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Дякуємо! Ми зв\'яжемося з вами найближчим часом', 'success');
            this.reset();
        });
    }

    // Detailed contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');
            const privacy = formData.get('privacy');

            // Basic validation
            if (!name || !phone || !email || !service || !message) {
                showNotification('Будь ласка, заповніть всі обов\'язкові поля', 'error');
                return;
            }

            if (!privacy) {
                showNotification('Будь ласка, погодьтеся з політикою конфіденційності', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Будь ласка, введіть коректну email адресу', 'error');
                return;
            }

            // Phone validation (Ukrainian format)
            const phoneRegex = /^(\+38|38|8)?[\s\-]?\(?0\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Будь ласка, введіть коректний номер телефону', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами протягом 24 годин', 'success');
            this.reset();
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .about-content, .section-header');
    animateElements.forEach(el => observer.observe(el));

    // Portfolio hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioDetailedItems = document.querySelectorAll('.portfolio-detailed-item');

    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Service details modal
    const serviceModal = document.getElementById('serviceModal');
    const serviceTitle = document.getElementById('serviceModalTitle');
    const servicePrice = document.getElementById('serviceModalPrice');
    const serviceContent = document.getElementById('serviceModalContent');
    const serviceFooter = document.getElementById('serviceModalFooter');
    const serviceButtons = document.querySelectorAll('.service-more-btn');

    const serviceDetails = {
        design: {
            title: "Дизайн-проєкт інтер'єру",
            price: "Вартість робіт: від 10 до 40 $ за м²",
            html: `
                <p>Комплексна розробка дизайну інтер'єру з урахуванням ваших побажань, функціональності та бюджету.</p>
                <h4>Що входить:</h4>
                <ul>
                    <li>Обмірний план та планувальні рішення</li>
                    <li>Плани електрики та освітлення</li>
                    <li>Розводка комунікацій</li>
                    <li>Розміщення меблів та розгортки стін</li>
                    <li>3D-візуалізації основних приміщень</li>
                    <li>Підбір матеріалів, меблів та сантехніки</li>
                    <li>Специфікації та відомості матеріалів</li>
                </ul>
                <p class="muted">Терміни виконання: від 2 до 7 тижнів. Пакет послуг формуємо індивідуально за запитом.</p>
            `,
            packages: [
                {
                    key: 'light',
                    name: 'Легкий старт',
                    suitsTitle: 'Підходить для тих, хто:',
                    suits: [
                        'має обмежений бюджет',
                        'може сам приймати участь у реалізації'
                    ],
                    featuresTitle: 'Що включає:',
                    features: [
                        'Зустріч на об’єкті для узгодження задачі',
                        'Обмірний план',
                        'Перелік креслень',
                        'План демонтажу',
                        'Перепланування (монтажний план)',
                        'Схеми до монтажу',
                        'Схема розміщення кондиціонерів',
                        'Розводка комунікацій',
                        'План електрики (розетки, вимикачі)',
                        'Візуалізація приміщень',
                        'Чат для спілкування активний на весь час проєктування'
                    ],
                    priceHtml: '<strong>Ціна:</strong> приміщення до 100 м² — $20/м²; приміщення до 200 м² — $15/м².'
                },
                {
                    key: 'optimal',
                    name: 'Оптимальний',
                    featuresTitle: 'Що включає:',
                    features: [
                        'Усе з пакета «Легкий старт»',
                        'Допомога у пошуку матеріалів'
                    ],
                    extrasTitle: 'Додатково отримуєте:',
                    extras: [
                        'Спілкування в чаті протягом реалізації',
                        'Дизайнерські знижки до 10%',
                        'Спілкування з майстрами'
                    ],
                    noteHtml: 'Виїзд на обʼєкт для консультації — $50.',
                    priceHtml: '<strong>Ціна:</strong> приміщення до 100 м² — $25/м²; приміщення до 200 м² — $20/м²; понад 200 м² — $15/м².'
                },
                {
                    key: 'premium',
                    name: 'Преміум',
                    description: 'Преміальний пакет містить розширений супровід та додаткові послуги. Ми уточнимо всі деталі під ваш проєкт за індивідуальним запитом.'
                },
                {
                    key: 'individual',
                    name: 'Індивідуально',
                    featuresTitle: 'Окремі послуги:',
                    features: [
                        'Електротехнічний план фактичної реалізації можна замовити окремо. Включає обмірний план + планувальні рішення. Вартість 15 $/м² (до 100 м²).',
                        'Обмірний план + 3 планувальні рішення. Вартість 5 $/м² (від 40 м²).'
                    ]
                }
            ]
        },
        turnkey: {
            title: "Ремонт під ключ",
            price: "Вартість робіт: від 280 $ за м²",
            html: `
                <p>Повний цикл ремонтно-оздоблювальних робіт з нашим контролем якості та дотриманням строків.</p>
                <h4>Що входить:</h4>
                <ul>
                    <li>Демонтажні та підготовчі роботи</li>
                    <li>Електромонтаж та сантехнічні роботи</li>
                    <li>Вирівнювання стін/стель, стяжка підлоги</li>
                    <li>Оздоблення: фарбування, шпалери, декоративні покриття, підлогові покриття</li>
                    <li>Монтаж міжкімнатних дверей, плінтусів, стель</li>
                    <li>Омеблювання всього об'єкта</li>
                    <li>Фінальне прибирання та здача об'єкта</li>
                </ul>
                <p class="muted">Матеріали — за окремим кошторисом (базовий/середній/преміум). Гарантія на роботи: 3 роки. Термін виконання: 3 місяці.</p>
            `
        },
        furniture: {
            title: "Облаштування об'єкту меблями",
            price: "Вартість послуг залежить від обсягу замовлення",
            html: `
                <p>Підбір, виготовлення та монтаж меблів під ваш інтер'єр з оптимальним балансом ціна/якість.</p>
                <h4>Що входить:</h4>
                <ul>
                    <li>Попередня консультація на етапі створення дизайн-проєкту</li>
                    <li>3D заміри на об'єкті</li>
                    <li>Ескізні рішення та підбір фурнітури (відеоогляд із салону / виїзд з замовником)</li>
                    <li>Виготовлення, доставка та монтаж</li>
                </ul>
                <p class="muted">Остаточну вартість формуємо після замірів і погодження ТЗ.</p>
            `
        }
    };

    function renderServicePackages(packages = []) {
        if (!packages.length || !serviceContent) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'service-packages';

        const tabs = document.createElement('div');
        tabs.className = 'package-tabs';

        const body = document.createElement('div');
        body.className = 'package-body';

        wrapper.appendChild(tabs);
        wrapper.appendChild(body);
        serviceContent.appendChild(wrapper);

        const activate = (index) => {
            const pkg = packages[index];
            if (!pkg) return;
            const tabButtons = tabs.querySelectorAll('.package-tab');
            tabButtons.forEach((btn, idx) => {
                const isActive = idx === index;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            body.innerHTML = '';
            body.classList.remove('package-body-animate');

            if (pkg.term || pkg.alias) {
                const meta = document.createElement('div');
                meta.className = 'package-meta';
                if (pkg.term) {
                    const termEl = document.createElement('span');
                    termEl.className = 'package-term';
                    termEl.textContent = pkg.term;
                    meta.appendChild(termEl);
                }
                if (pkg.alias) {
                    const aliasEl = document.createElement('span');
                    aliasEl.className = 'package-alias';
                    aliasEl.textContent = `«${pkg.alias}»`;
                    meta.appendChild(aliasEl);
                }
                body.appendChild(meta);
            }

            const titleEl = document.createElement('h4');
            titleEl.className = 'package-title';
            titleEl.textContent = pkg.name;
            body.appendChild(titleEl);

            if (pkg.suits && pkg.suits.length) {
                const suitsBlock = document.createElement('div');
                suitsBlock.className = 'package-section suits';
                if (pkg.suitsTitle) {
                    const suitsTitle = document.createElement('h5');
                    suitsTitle.textContent = pkg.suitsTitle;
                    suitsBlock.appendChild(suitsTitle);
                }
                const suitsList = document.createElement('ul');
                suitsList.className = 'package-list';
                pkg.suits.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    suitsList.appendChild(li);
                });
                suitsBlock.appendChild(suitsList);
                body.appendChild(suitsBlock);
            }

            if (pkg.features && pkg.features.length) {
                const featBlock = document.createElement('div');
                featBlock.className = 'package-section features';
                if (pkg.featuresTitle) {
                    const featTitle = document.createElement('h5');
                    featTitle.textContent = pkg.featuresTitle;
                    featBlock.appendChild(featTitle);
                }
                const featList = document.createElement('ul');
                featList.className = 'package-list package-feature-list';
                pkg.features.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    featList.appendChild(li);
                });
                featBlock.appendChild(featList);
                body.appendChild(featBlock);
            }

            if (pkg.extras && pkg.extras.length) {
                const extrasBlock = document.createElement('div');
                extrasBlock.className = 'package-section upgrades';
                if (pkg.extrasTitle) {
                    const extrasTitle = document.createElement('h5');
                    extrasTitle.textContent = pkg.extrasTitle;
                    extrasBlock.appendChild(extrasTitle);
                }
                const extrasList = document.createElement('ul');
                extrasList.className = 'package-list';
                pkg.extras.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    extrasList.appendChild(li);
                });
                extrasBlock.appendChild(extrasList);
                body.appendChild(extrasBlock);
            }

            if (pkg.drawings && pkg.drawings.length) {
                const drawingsBlock = document.createElement('div');
                drawingsBlock.className = 'package-section drawings';
                const drList = document.createElement('ul');
                drList.className = 'package-list';
                if (pkg.drawingsTitle) {
                    const titleItem = document.createElement('li');
                    titleItem.textContent = pkg.drawingsTitle;
                    titleItem.className = 'package-list-title';
                    drList.appendChild(titleItem);
                }
                pkg.drawings.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    drList.appendChild(li);
                });
                drawingsBlock.appendChild(drList);
                body.appendChild(drawingsBlock);
            }

            if (pkg.noteHtml || pkg.note) {
                const note = document.createElement('p');
                note.className = 'package-note muted';
                if (pkg.noteHtml) {
                    note.innerHTML = pkg.noteHtml;
                } else {
                    note.textContent = pkg.note;
                }
                body.appendChild(note);
            }

            if (pkg.priceHtml || pkg.price) {
                const price = document.createElement('p');
                price.className = 'package-price';
                if (pkg.priceHtml) {
                    price.innerHTML = pkg.priceHtml;
                } else {
                    price.textContent = pkg.price;
                }
                body.appendChild(price);
            }

            if (pkg.description && !pkg.features && !pkg.drawings) {
                const desc = document.createElement('p');
                desc.className = 'package-description';
                desc.textContent = pkg.description;
                body.appendChild(desc);
            } else if (pkg.description) {
                const desc = document.createElement('p');
                desc.className = 'package-description muted';
                desc.textContent = pkg.description;
                body.appendChild(desc);
            }

            void body.offsetWidth; // restart animation
            body.classList.add('package-body-animate');
        };

        packages.forEach((pkg, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'package-tab';
            btn.textContent = pkg.name;
            btn.setAttribute('data-package', pkg.key || `pkg-${index}`);
            btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
            btn.addEventListener('click', () => activate(index));
            tabs.appendChild(btn);
        });

        activate(0);
    }

    function openServiceModal(key) {
        const data = serviceDetails[key];
        if (!data || !serviceModal) return;
        serviceTitle.textContent = data.title;
        servicePrice.textContent = data.price;
        serviceContent.innerHTML = data.html;
        if (data.packages && data.packages.length) {
            serviceFooter && (serviceFooter.style.display = 'none');
            renderServicePackages(data.packages);
        } else {
            serviceFooter && (serviceFooter.style.display = '');
        }
        serviceModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // focus management
        const closeBtn = serviceModal.querySelector('.modal-close');
        closeBtn && closeBtn.focus();
    }

    function closeServiceModal() {
        if (!serviceModal) return;
        serviceModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (serviceModal) {
        serviceModal.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('[data-close="modal"], .modal-overlay')) {
                closeServiceModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && serviceModal.getAttribute('aria-hidden') === 'false') {
                closeServiceModal();
            }
        });
    }

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-service');
            openServiceModal(key);
        });
    });

    // Ensure modal CTA closes modal then scrolls
    document.addEventListener('click', (e) => {
        const cta = e.target.closest('.modal-cta');
        if (!cta) return;
        e.preventDefault();
        const href = cta.getAttribute('href') || '#contacts';
        closeServiceModal();
        setTimeout(() => smoothScrollTo(href), 30);
    });

    // Portfolio gallery modal
    const galleryModal = document.getElementById('galleryModal');
    const galleryTitle = document.getElementById('galleryModalTitle');
    const galleryImage = document.getElementById('galleryImage');
    const galleryCounter = document.getElementById('galleryCounter');
    const galleryThumbnails = document.getElementById('galleryThumbnails');
    const galleryPrev = galleryModal ? galleryModal.querySelector('.gallery-prev') : null;
    const galleryNext = galleryModal ? galleryModal.querySelector('.gallery-next') : null;
    const galleryMap = {
        lakewood: {
            title: 'Lakewood',
            baseDir: 'images/portfolio/lakewood',
            images: [],
            fallback: [
                'https://images.unsplash.com/photo-1505691723518-36a80d84c921?auto=format&fit=crop&w=1600&q=60',
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=60',
                'https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=1600&q=60'
            ]
        },
        great: {
            title: 'Грейт',
            baseDir: 'images/portfolio/great',
            images: [],
            fallback: [
                'https://images.unsplash.com/photo-1502005229762-cf1b2da7c08a?auto=format&fit=crop&w=1600&q=60',
                'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=60',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=60'
            ]
        }
    };

    let currentGalleryKey = null;
    let currentIndex = 0;

    function getGalleryList(data) {
        if (!data) return [];
        return (data.images && data.images.length) ? data.images : data.fallback;
    }

    const GALLERY_MANIFEST_URL = 'images/portfolio/gallery-manifest.json';
    const GALLERY_MANIFEST_STORAGE_KEY = 'pp-gallery-manifest-v1';
    const GALLERY_MANIFEST_MAX_AGE = 1000 * 60 * 60 * 12; // 12 hours
    let galleryManifestPromise = null;
    let galleryManifest = null;

    function getStoredManifest() {
        try {
            const raw = localStorage.getItem(GALLERY_MANIFEST_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !parsed.data || !parsed.timestamp) return null;
            if (Date.now() - parsed.timestamp > GALLERY_MANIFEST_MAX_AGE) return null;
            return parsed.data;
        } catch (e) {
            return null;
        }
    }

    function storeManifest(data) {
        try {
            localStorage.setItem(GALLERY_MANIFEST_STORAGE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) { /* ignore quota errors */ }
    }

    function loadGalleryManifest() {
        if (galleryManifestPromise) return galleryManifestPromise;
        galleryManifestPromise = (async () => {
            if (!galleryManifest) {
                galleryManifest = getStoredManifest();
            }
            try {
                const res = await fetch(`${GALLERY_MANIFEST_URL}?t=${Date.now()}`, { cache: 'no-cache' });
                if (res.ok) {
                    const data = await res.json();
                    galleryManifest = data;
                    storeManifest(data);
                }
            } catch (e) {
                // keep cached version if network fails
            }
            return galleryManifest || {};
        })();
        return galleryManifestPromise;
    }

    function ensureGalleryData(key) {
        const data = galleryMap[key];
        if (!data) return Promise.resolve([]);
        if (data.images && data.images.length) return Promise.resolve(data.images);
        return loadGalleryManifest()
            .then(manifest => {
                const list = manifest && manifest[key] ? manifest[key] : [];
                if (list.length) data.images = list;
                return data.images || [];
            })
            .catch(() => data.images || []);
    }

    // Warm up manifest fetch so gallery opens instantly on first tap
    loadGalleryManifest().catch(() => {});

    function highlightActiveThumbnail(idx) {
        if (!galleryThumbnails) return;
        const children = galleryThumbnails.querySelectorAll('.gallery-thumb');
        children.forEach(btn => {
            const btnIndex = Number(btn.getAttribute('data-index'));
            btn.classList.toggle('active', btnIndex === idx);
        });
    }

    function renderGalleryThumbnails(key) {
        if (!galleryThumbnails) return;
        const data = galleryMap[key];
        if (!data) return;
        const list = getGalleryList(data);
        galleryThumbnails.innerHTML = '';
        list.forEach((src, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gallery-thumb';
            btn.setAttribute('data-index', String(idx));
            const isPdf = /\.pdf($|\?)/i.test(src);
            btn.setAttribute('aria-label', isPdf ? `Відкрити PDF ${idx + 1}` : `Переглянути зображення ${idx + 1}`);
            if (isPdf) {
                const span = document.createElement('span');
                span.textContent = 'PDF';
                btn.appendChild(span);
            } else {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Мініатюра ${idx + 1}`;
                img.loading = 'lazy';
                btn.appendChild(img);
            }
            btn.addEventListener('click', () => {
                if (currentGalleryKey !== key) {
                    currentGalleryKey = key;
                }
                showGalleryImage(idx);
            });
            galleryThumbnails.appendChild(btn);
        });
        highlightActiveThumbnail(currentIndex);
    }

    function showGalleryImage(idx) {
        const data = galleryMap[currentGalleryKey];
        if (!data) return;
        const list = getGalleryList(data);
        const total = list.length;
        currentIndex = (idx + total) % total;
        galleryCounter.textContent = `${currentIndex + 1} / ${total}`;
        const src = list[currentIndex];

        const pdfFrame = document.getElementById('galleryPdfFrame');

        function showImg(url) {
            pdfFrame.style.display = 'none';
            galleryImage.style.display = 'block';
            galleryImage.src = url;
            galleryImage.onerror = () => {
                galleryImage.onerror = null;
                // Try PDF with the same base name
                const pdfUrl = url.replace(/\.(jpg|jpeg|png|webp)$/i, '.pdf');
                showPdf(pdfUrl);
            };
        }

        function showPdf(url) {
            galleryImage.style.display = 'none';
            pdfFrame.style.display = 'block';
            // Add minimal viewer params to improve mobile rendering
            const viewParams = '#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit';
            pdfFrame.src = url + viewParams;
        }

        if (/\.pdf($|\?)/i.test(src)) {
            showPdf(src);
        } else {
            showImg(src);
        }
        highlightActiveThumbnail(currentIndex);
    }

    async function openGallery(key) {
        const data = galleryMap[key];
        if (!data || !galleryModal) return;
        currentGalleryKey = key;
        currentIndex = 0;
        galleryTitle.textContent = data.title;
        galleryCounter.textContent = '...';
        galleryImage.src = '';
        galleryModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        try {
            await ensureGalleryData(key);
        } catch (e) { /* silent */ }
        if (currentGalleryKey !== key) return;
        renderGalleryThumbnails(key);
        showGalleryImage(currentIndex);
    }

    function closeGallery() {
        if (!galleryModal) return;
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target.matches('[data-close="modal"], .modal-overlay')) {
                closeGallery();
            }
        });
        document.addEventListener('keydown', (e) => {
            const isOpen = galleryModal.getAttribute('aria-hidden') === 'false';
            if (!isOpen) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowRight') showGalleryImage(currentIndex + 1);
            if (e.key === 'ArrowLeft') showGalleryImage(currentIndex - 1);
        });
        galleryPrev && galleryPrev.addEventListener('click', () => showGalleryImage(currentIndex - 1));
        galleryNext && galleryNext.addEventListener('click', () => showGalleryImage(currentIndex + 1));
    }

    // Open gallery on portfolio item click and set preview thumbnails
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.portfolio-item[data-gallery]');
        if (!item) return;
        e.preventDefault();
        const key = item.getAttribute('data-gallery');
        openGallery(key);
    });

    // Initialize portfolio previews from existing files
    // Initialize previews on first viewport entry to avoid initial lag
    (function initPortfolioPreviewsLazy() {
        const section = document.getElementById('portfolio');
        if (!section) return;
        const run = async () => {
            const items = document.querySelectorAll('.portfolio-item[data-gallery]');
            for (const item of items) {
                const key = item.getAttribute('data-gallery');
                const data = galleryMap[key];
                if (!data) continue;
                try {
                    const list = await ensureGalleryData(key);
                    const usableList = (list && list.length) ? list : getGalleryList(data);
                    if (usableList.length) data.images = usableList;
                    const thumb = usableList.find(u => !/\.pdf($|\?)/i.test(u));
                    const imgEl = item.querySelector('img');
                    if (thumb && imgEl) imgEl.src = thumb;
                } catch (e) { /* noop */ }
            }
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    io.disconnect();
                    run();
                }
            });
        }, { threshold: 0.1 });
        io.observe(section);
    })();

    // Active navigation link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Lazy loading for images (when real images are added)
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Portfolio filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length > 0 && portfolioDetailedItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                portfolioDetailedItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Add initial styles for smooth transitions
        portfolioDetailedItems.forEach(item => {
            item.style.transition = 'all 0.3s ease';
        });
    }

    // Scroll to top functionality
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Повернутися нагору');

    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', scrollToTop);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
});

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digits
    let value = input.value.replace(/\D/g, '');

    // Ukrainian phone number formatting
    if (value.startsWith('380')) {
        value = value.substring(3);
    } else if (value.startsWith('80')) {
        value = value.substring(2);
    } else if (value.startsWith('0')) {
        value = value.substring(1);
    }

    // Format as (0XX) XXX-XX-XX
    if (value.length >= 2) {
        value = '0' + value;
        if (value.length >= 4) {
            value = value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d+)/, '($1) $2');
        }
    }

    input.value = value;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});
