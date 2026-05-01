document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive Hover Effects on Data Points
    const dataPoints = document.querySelectorAll('.data-point');
    
    dataPoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            point.setAttribute('r', '6');
            point.style.cursor = 'pointer';
            point.style.filter = 'drop-shadow(0 0 8px #00f0ff)';
        });
        
        point.addEventListener('mouseleave', () => {
            point.setAttribute('r', '4');
            point.style.filter = 'none';
        });
    });

    // 2. Parallax effect for the background grid
    const bgGrid = document.querySelector('.bg-grid');
    
    document.addEventListener('mousemove', (e) => {
        // Calculate movement, keeping it subtle
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        
        if (bgGrid) {
            bgGrid.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // 3. Navigation interaction (Visual only)
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');
        });
    });

    // 4. Glow button interactive logic (Optional extra effect)
    const ctaBtn = document.querySelector('.cta-button');
    
    if(ctaBtn) {
        ctaBtn.addEventListener('mousemove', (e) => {
            const rect = ctaBtn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Can be used in CSS with radial-gradient at var(--x), var(--y)
            ctaBtn.style.setProperty('--x', `${x}px`);
            ctaBtn.style.setProperty('--y', `${y}px`);
        });
    }
    // --- COOKIE MANAGEMENT LOGIC ---
    const cookieBanner = document.getElementById('cookie-banner');
    const privacyModal = document.getElementById('privacy-modal');
    const customizeModal = document.getElementById('customize-modal');
    
    const btnAccept = document.getElementById('cookie-accept');
    const btnRefuse = document.getElementById('cookie-refuse');
    const btnCustomize = document.getElementById('cookie-customize');
    const btnSavePref = document.getElementById('save-preferences');
    const btnOpenPrivacy = document.getElementById('open-privacy');
    
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Check if user already made a choice
    const cookieChoice = localStorage.getItem('cookie-consent');
    
    if (!cookieChoice) {
        setTimeout(() => {
            if (cookieBanner) cookieBanner.classList.add('show');
        }, 1000);
    }
    
    // Accept All
    if (btnAccept) {
        btnAccept.addEventListener('click', () => {
            saveConsent({
                technical: true,
                analytics: true,
                marketing: true
            });
        });
    }
    
    // Refuse All (except technical)
    if (btnRefuse) {
        btnRefuse.addEventListener('click', () => {
            saveConsent({
                technical: true,
                analytics: false,
                marketing: false
            });
        });
    }
    
    // Open Customize Modal
    if (btnCustomize) {
        btnCustomize.addEventListener('click', () => {
            customizeModal.classList.add('show');
        });
    }
    
    // Save Custom Preferences
    if (btnSavePref) {
        btnSavePref.addEventListener('click', () => {
            const analytics = document.getElementById('cookie-analytics').checked;
            const marketing = document.getElementById('cookie-marketing').checked;
            
            saveConsent({
                technical: true,
                analytics: analytics,
                marketing: marketing
            });
            customizeModal.classList.remove('show');
        });
    }
    
    // Privacy Modal
    if (btnOpenPrivacy) {
        btnOpenPrivacy.addEventListener('click', () => {
            privacyModal.classList.add('show');
        });
    }
    
    // Close Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            privacyModal.classList.remove('show');
            customizeModal.classList.remove('show');
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === privacyModal) privacyModal.classList.remove('show');
        if (e.target === customizeModal) customizeModal.classList.remove('show');
    });
    
    function saveConsent(preferences) {
        localStorage.setItem('cookie-consent', JSON.stringify(preferences));
        if (cookieBanner) cookieBanner.classList.remove('show');
        
        // Trigger actual cookie loading based on preferences if needed
        console.log('Cookies saved:', preferences);
    }
});
