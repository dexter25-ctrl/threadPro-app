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
});
