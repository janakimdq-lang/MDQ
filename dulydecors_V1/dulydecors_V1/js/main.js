/* ===================================================
   DULY DECORS — MAIN JAVASCRIPT
=================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- PAGE LOADER ---------- */
    const loader = document.getElementById('page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 650);
            }, 900);
        });
    }

    /* ---------- AOS INIT ---------- */
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 850, easing: 'ease-out-quad', once: true, offset: 70 });
    }

    /* ---------- STICKY NAVBAR ---------- */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* ---------- HERO PARALLAX / BG LOADED ---------- */
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        setTimeout(() => heroSection.classList.add('loaded'), 100);
    }

    /* ---------- MOBILE MENU ---------- */
    const menuBtn    = document.getElementById('menu-btn');
    const menuClose  = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        mobileMenu && mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
        mobileMenu && mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    };

    menuBtn   && menuBtn.addEventListener('click', openMenu);
    menuClose && menuClose.addEventListener('click', closeMenu);
    mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    /* ---------- ACTIVE NAV LINK ---------- */
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a:not(.nav-cta), .mobile-menu a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    /* ---------- COUNTER ANIMATION ---------- */
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const end    = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const dur    = 1800;
            const step   = end / (dur / 16);
            let cur = 0;
            const timer = setInterval(() => {
                cur += step;
                if (cur >= end) { cur = end; clearInterval(timer); }
                el.textContent = Math.floor(cur) + suffix;
            }, 16);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));

    /* ---------- PROGRESS BARS ---------- */
    const progBars = document.querySelectorAll('.progress-fill');
    const progressObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            bar.style.width = (bar.dataset.width || '0') + '%';
            progressObs.unobserve(bar);
        });
    }, { threshold: 0.3 });
    progBars.forEach(b => { b.style.width = '0'; progressObs.observe(b); });

    /* ---------- PROJECT FILTER ---------- */
    const filterTabs  = document.querySelectorAll('.filter-tab');
    const projectItems = document.querySelectorAll('.project-item');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            projectItems.forEach(item => {
                const show = filter === 'all' || item.dataset.status === filter;
                item.style.display = show ? '' : 'none';
                if (show) item.style.animation = 'fadeInUp 0.4s ease both';
            });
        });
    });

    /* ---------- SWIPER TESTIMONIALS ---------- */
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-swiper')) {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                640:  { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });
    }

    /* ---------- CONTACT FORM ---------- */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name    = (form.querySelector('#name')?.value    || '').trim();
            const phone   = (form.querySelector('#phone')?.value   || '').trim();
            const email   = (form.querySelector('#email')?.value   || '').trim();
            const message = (form.querySelector('#message')?.value || '').trim();

            if (!name || !phone || !email || !message) {
                return showToast('Please fill in all required fields.', 'error');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showToast('Please enter a valid email address.', 'error');
            }
            if (!/^[\d\s\+\-\(\)]{10,}$/.test(phone)) {
                return showToast('Please enter a valid phone number.', 'error');
            }

            const btn = form.querySelector('[type="submit"]');
            const origHtml = btn.innerHTML;
            btn.innerHTML  = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending…';
            btn.disabled   = true;

            setTimeout(() => {
                showToast('Thank you! We\'ll be in touch shortly.', 'success');
                form.reset();
                btn.innerHTML = origHtml;
                btn.disabled  = false;
            }, 2000);
        });
    }

    function showToast(msg, type = 'success') {
        document.querySelectorAll('.toast').forEach(t => t.remove());
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 4500);
    }

    /* ---------- LIGHTBOX ---------- */
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    document.querySelectorAll('.gallery-img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.dataset.full || img.src;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    function closeLightbox() {
        lightbox?.classList.remove('open');
        document.body.style.overflow = '';
    }

    /* ---------- KEYBOARD SHORTCUTS ---------- */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeLightbox(); closeMenu(); }
    });

    /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---------- SCROLL TO TOP BUTTON ---------- */
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
        window.addEventListener('scroll', () => {
            scrollTop.classList.toggle('opacity-0', window.scrollY < 400);
            scrollTop.classList.toggle('pointer-events-none', window.scrollY < 400);
        }, { passive: true });
        scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
