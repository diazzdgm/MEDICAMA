/* ===================================
   MEDICAMA - JAVASCRIPT PRINCIPAL
   =================================== */

// Variables globales
let isMenuOpen = false;
let lastScrollTop = 0;

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funciones
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFloatingButtons();
    initSmoothScrolling();
    initMobileMenu();
    initFAQ();
    initTypingEffect();
    initProductCarousel();
    initAnchorTracking();
    initCleanURLNavigation();
    
    console.log('MEDICAMA - Sitio web inicializado correctamente');
});

/* ===================================
   NAVEGACIÓN
   =================================== */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Efecto de scroll en navbar
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Resaltar enlace activo según la sección visible
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.3
    };
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/* ===================================
   MENÚ MÓVIL
   =================================== */

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Cerrar menú al hacer click en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMenuOpen) {
                    toggleMobileMenu();
                }
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                toggleMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        navMenu.classList.add('active');
        mobileMenuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ===================================
   SCROLL SUAVE
   =================================== */

function initSmoothScrolling() {
    // Scroll suave para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Compensar altura del navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   EFECTOS DE SCROLL
   =================================== */

function initScrollEffects() {
    // Botón scroll to top
    createScrollToTopButton();
    
    // Parallax effect en hero (opcional) - DESHABILITADO
    // const hero = document.querySelector('.hero');
    // if (hero) {
    //     window.addEventListener('scroll', function() {
    //         const scrolled = window.pageYOffset;
    //         const rate = scrolled * -0.5;
    //         hero.style.transform = `translateY(${rate}px)`;
    //     });
    // }
}

function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Volver arriba');
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    document.body.appendChild(scrollBtn);
}

/* ===================================
   BOTONES FLOTANTES
   =================================== */

function initFloatingButtons() {
    createWhatsAppButton();
}

function createWhatsAppButton() {
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/527297230763?text=Hola,%20me%20interesa%20rentar%20una%20cama%20de%20hospital.%20¿Podrían%20proporcionarme%20más%20información?';
    whatsappBtn.target = '_blank';
    whatsappBtn.innerHTML = '<img src="./assets/images/whatsapp.logo.png" alt="WhatsApp" style="width: 120px; height: 120px;">';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
    
    whatsappBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(whatsappBtn);
}

/* ===================================
   ANIMACIONES
   =================================== */

function initAnimations() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Agregar clase para animaciones CSS adicionales
                entry.target.classList.add('animated');
                
                // Desobservar el elemento una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos con clase fade-in-up
    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
    
    // Animación de contadores (si los hubiera)
    initCounterAnimations();
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter'));
        const duration = 2000; // 2 segundos
        let current = 0;
        const increment = target / (duration / 16); // 60fps
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                    
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

/* ===================================
   NUEVA FUNCIÓN PARA ANIMACIÓN DE CAÍDA
   =================================== */

function initTypingEffect() {
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        // Asegurar que el título sea completamente visible
        heroTitle.style.transform = '';
        heroTitle.style.opacity = '1';
        heroTitle.style.visibility = 'visible';
        
        // Aplicar animación CSS simple
        heroTitle.classList.add('fade-in-up');
    }
}

function typeWriter(element, html, speed = 100) {
    let i = 0;
    const text = element.textContent;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML = html.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ===================================
   CALCULADORA DE PRECIOS
   =================================== */

function calculatePrice() {
    const tipoCama = document.getElementById('tipo-cama')?.value;
    const duracion = document.getElementById('duracion')?.value;
    const priceEstimate = document.getElementById('price-estimate');
    const estimatedPrice = document.getElementById('estimated-price');
    
    if (!tipoCama || !duracion || !priceEstimate || !estimatedPrice) {
        return;
    }
    
    let precioBase = 0;
    switch(tipoCama) {
        case 'manual': precioBase = 150; break;
        case 'electrica': precioBase = 250; break;
        case 'uci': precioBase = 400; break;
    }

    if (precioBase > 0) {
        let dias = 1;
        let descuento = 1;
        let textoDescuento = '';
        
        switch(duracion) {
            case '1-7': 
                dias = 7; 
                descuento = 0.95; 
                textoDescuento = ' (5% descuento)';
                break;
            case '1-4': 
                dias = 28; 
                descuento = 0.90; 
                textoDescuento = ' (10% descuento)';
                break;
            case '1-6': 
                dias = 180; 
                descuento = 0.85; 
                textoDescuento = ' (15% descuento)';
                break;
            case '6+': 
                dias = 365; 
                descuento = 0.80; 
                textoDescuento = ' (20% descuento)';
                break;
        }

        const precioTotal = precioBase * dias * descuento;
        const precioPromedio = precioTotal / dias;
        
        estimatedPrice.innerHTML = `
            ${precioTotal.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} total 
            (${precioPromedio.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}/día)${textoDescuento}
        `;
        
        priceEstimate.style.display = 'block';
    } else {
        priceEstimate.style.display = 'none';
    }
}

/* ===================================
   UTILIDADES
   =================================== */

// Debounce function para optimizar eventos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para obtener parámetros de URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove después del tiempo especificado
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, duration);
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar teléfono mexicano
function isValidPhone(phone) {
    const phoneRegex = /^(\+52|52)?\s*[1-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/* ===================================
   MANEJO DE ERRORES
   =================================== */

// Manejo global de errores
window.addEventListener('error', function(e) {
    console.error('Error en MEDICAMA:', e.error);
    
    // En producción, enviar errores a servicio de logging
    // logError(e.error);
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesa rechazada en MEDICAMA:', e.reason);
    
    // En producción, enviar errores a servicio de logging
    // logError(e.reason);
});

/* ===================================
   PERFORMANCE
   =================================== */

// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Precargar recursos críticos
function preloadCriticalResources() {
    const criticalImages = [
        './assets/images/hero-image.jpg',
        './assets/images/logo.svg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initLazyLoading();
        preloadCriticalResources();
    });
} else {
    initLazyLoading();
    preloadCriticalResources();
}

/* ===================================
   FAQ FUNCTIONALITY
   =================================== */

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                // Cerrar otras preguntas abiertas
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle de la pregunta actual
                item.classList.toggle('active');
                
                // Log para debugging
                console.log('FAQ item clicked:', question.textContent);
            });
        }
    });
    
    console.log('FAQ functionality initialized for', faqItems.length, 'items');
}

/* ===================================
   VIDEO MODAL FUNCTIONALITY
   =================================== */

function openVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('productVideo');
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        
        // El video se carga automáticamente desde el HTML
        if (video) {
            video.currentTime = 0; // Reset video to beginning
        }
        
        console.log('Video modal opened');
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('productVideo');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore body scroll
        
        // Pause and reset video
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        
        console.log('Video modal closed');
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeVideoModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeVideoModal();
    }
});

/* ===================================
   PRODUCT CAROUSEL
   =================================== */

let currentSlide = 0;
let carouselInterval;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = 5;


function initProductCarousel() {
    // Start auto-play
    startCarouselAutoPlay();
    
    // Pause on hover
    const carousel = document.getElementById('productCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarouselAutoPlay);
        carousel.addEventListener('mouseleave', startCarouselAutoPlay);
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function updateCarousel() {
    // Update slides
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startCarouselAutoPlay() {
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 4000); // Change every 4 seconds
}

function stopCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Expose functions to global scope for HTML onclick handlers
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;

/* ===================================
   ANCHOR TRACKING PARA CONVERSIONES
   =================================== */

function initAnchorTracking() {
    // Track clicks en botones CTA
    document.addEventListener('click', function(e) {
        const ctaElement = e.target.closest('[data-cta]');
        if (ctaElement) {
            const ctaType = ctaElement.getAttribute('data-cta');
            console.log('CTA Click:', ctaType);
            
            // Enviar evento a Google Analytics si está disponible
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'engagement',
                    'event_label': ctaType,
                    'custom_parameter': window.location.hash || 'direct'
                });
            }
        }
    });
    
    // Track anchor changes (navigation)
    window.addEventListener('hashchange', function() {
        const anchor = window.location.hash.substring(1);
        console.log('Anchor Navigation:', anchor);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'anchor_navigation', {
                'event_category': 'navigation',
                'event_label': anchor,
                'custom_parameter': 'anchor_click'
            });
        }
    });
    
    // Track form submissions
    const forms = document.querySelectorAll('[data-form]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const formType = form.getAttribute('data-form');
            console.log('Form Submit:', formType);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'conversion',
                    'event_label': formType,
                    'custom_parameter': window.location.hash || 'direct'
                });
            }
        });
    });
}

/* ===================================
   NAVEGACIÓN CON URLs LIMPIAS
   =================================== */

function initCleanURLNavigation() {
    // Mapeo de URLs limpias a secciones
    const urlSectionMap = {
        '/contacto': 'contacto',
        '/productos': 'productos', 
        '/precios': 'precios',
        '/proceso': 'proceso',
        '/garantia': 'garantia',
        '/testimonios': 'testimonios',
        '/preguntas': 'preguntas',
        '/': 'inicio'
    };
    
    // Función de respaldo para navegación directa
    window.navigateToSection = function(sectionId) {
        console.log('Navegación directa a:', sectionId);
        const section = document.getElementById(sectionId);
        if (section) {
            // Encontrar la URL correspondiente
            let targetUrl = '/';
            for (const [url, id] of Object.entries(urlSectionMap)) {
                if (id === sectionId) {
                    targetUrl = url;
                    break;
                }
            }
            
            // Actualizar URL sin recargar
            history.pushState({ section: sectionId }, '', targetUrl);
            
            // Hacer scroll
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Tracking para analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    'event_category': 'navigation',
                    'event_label': targetUrl,
                    'custom_parameter': 'onclick_navigation'
                });
            }
        }
    };
    
    // Función para hacer scroll a una sección
    function scrollToSection(sectionId) {
        console.log('Intentando scroll a sección:', sectionId);
        const section = document.getElementById(sectionId);
        if (section) {
            console.log('Sección encontrada, haciendo scroll');
            // Agregar un pequeño delay para asegurar que el DOM esté listo
            setTimeout(() => {
                section.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        } else {
            console.error('Sección no encontrada:', sectionId);
        }
    }
    
    // Interceptar clicks en enlaces de navegación
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Solo procesar enlaces internos que empiecen con / (excluyendo archivos .html)
        if (href.startsWith('/') && !href.includes('.html')) {
            e.preventDefault();
            
            let path = href;
            console.log('Navegando a:', path);
            
            // Buscar la sección correspondiente
            const sectionId = urlSectionMap[path];
            if (sectionId) {
                console.log('Sección encontrada:', sectionId);
                
                // Cambiar la URL sin recargar
                history.pushState({ section: sectionId }, '', path);
                
                // Hacer scroll a la sección
                scrollToSection(sectionId);
                
                // Tracking para analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'clean_url_navigation', {
                        'event_category': 'navigation',
                        'event_label': path,
                        'custom_parameter': 'clean_url'
                    });
                }
            }
        }
    });
    
    // Manejar el botón atrás/adelante del navegador
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.section) {
            scrollToSection(e.state.section);
        } else {
            // Si no hay estado, determinar por la URL actual
            const currentPath = window.location.pathname;
            const sectionId = urlSectionMap[currentPath];
            if (sectionId) {
                scrollToSection(sectionId);
            }
        }
    });
    
    // Manejar la carga inicial si hay una URL específica
    function handleInitialLoad() {
        const currentPath = window.location.pathname;
        console.log('URL actual al cargar:', currentPath);
        const sectionId = urlSectionMap[currentPath];
        console.log('Sección mapeada:', sectionId);
        
        if (sectionId && sectionId !== 'inicio') {
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 500); // Aumentar delay para asegurar que todo esté cargado
        }
    }
    
    // Ejecutar cuando la página esté completamente cargada
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleInitialLoad);
    } else {
        handleInitialLoad();
    }
}