// Extracted from index.html\n// Hide loading overlay when page is loaded
        window.addEventListener('load', () => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
            }, 500);
        });
        
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const html = document.documentElement;
        
        // Check for saved preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            html.classList.add('dark');
        }
        
        darkModeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const theme = html.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
        
        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Smooth Scrolling for Navigation Links
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offset = 80; // Header height
                        const targetPosition = target.offsetTop - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
        
        // Bio Toggle
        const bioToggle = document.getElementById('bioToggle');
        const professionalBio = document.getElementById('professionalBio');
        const personalBio = document.getElementById('personalBio');
        
        bioToggle.addEventListener('change', () => {
            if (bioToggle.checked) {
                professionalBio.classList.add('hidden');
                personalBio.classList.remove('hidden');
            } else {
                professionalBio.classList.remove('hidden');
                personalBio.classList.add('hidden');
            }
        });
        
        // Contact Form Handler
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Sending...';
            formStatus.innerHTML = '';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.innerHTML = '<p class="text-green-600 dark:text-green-400">Message sent successfully! I\'ll get back to you soon.</p>';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formStatus.innerHTML = '<p class="text-red-600 dark:text-red-400">Oops! There was an error sending your message. Please try again.</p>';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
        
        // Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
        
        // Add scroll animations to elements
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.project-card, .skill-tag');
            elements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible && !element.classList.contains('animated')) {
                    setTimeout(() => {
                        element.classList.add('animate-slide-up');
                        element.classList.add('animated');
                    }, index * 100);
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);
        
        // Parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('#home .absolute');
            if (parallax) {
                const speed = 0.5;
                parallax.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
        
        // Lazy Loading for Images
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            const lazyLoadScript = document.createElement('script');
            lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(lazyLoadScript);
        }
        
        // Performance Monitoring
        if ('PerformanceObserver' in window) {
            // Log Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {}
            
            // Log First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {}
            
            // Log Cumulative Layout Shift
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            console.log('CLS:', clsValue);
                        }
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {}
        }
        
        // Improved Error Handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.message, e.filename, e.lineno, e.colno);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
        
        // Register Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful:', registration.scope);
                    })
                    .catch(err => {
                        console.log('ServiceWorker registration failed:', err);
                    });
            });
        }
        
        // Magnetic Button Effect
        document.querySelectorAll('.magnetic-button').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
        
        // Enhanced Ripple Effect
        document.querySelectorAll('.ripple').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add CSS for ripple effect dynamically
        const style = document.createElement('style');
        style.textContent = `
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);