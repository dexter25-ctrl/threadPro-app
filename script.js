// Tailwind CSS Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                slate: {
                    800: '#1e293b',
                    900: '#0f172a',
                }
            }
        }
    }
};

// Application Logic
document.addEventListener('DOMContentLoaded', () => {
    const contentForm = document.getElementById('content-form');
    const sourceContentInput = document.getElementById('source-content');
    const threadContainer = document.getElementById('thread-container');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = document.getElementById('copy-text');
    const langToggleBtn = document.getElementById('lang-toggle');

    let currentThread = [];
    let currentLang = 'fr'; // Default to French as requested

    const translations = {
        fr: {
            subtitle: "SaaS d'entreprise : De contenu à Thread",
            dashboard: "Tableau de bord",
            inputTitle: "Contenu source",
            inputLabel: "Collez votre article, blog ou idées",
            inputPlaceholder: "Ex : Ces dernières années, l'intelligence artificielle a fondamentalement transformé...",
            toneLabel: "Ton :",
            toneProfessional: "Professionnel",
            toneCreative: "Créatif",
            toneHumorous: "Humoristique",
            toneSarcastic: "Sarcastique",
            toneEducational: "Éducatif",
            toneMinimalist: "Minimaliste",
            toneControversial: "Controversé",
            toneStoryteller: "Storyteller",
            toneUrgency: "Urgence",
            tonePhilosophical: "Philosophique",
            wordLimit: "Limite de ~2500 mots",
            generateBtn: "Générer le Thread",
            previewTitle: "Aperçu du Thread",
            copyBtn: "Copier le Thread",
            footer: "© 2024 ThreadPro. Enterprise SaaS MVP.",
            errorEmpty: "Veuillez entrer du texte.",
            generating: "Génération...",
            copied: "Copié !",
            limitReached: "Limite gratuite atteinte (5/5)",
            upgradePrompt: "Passez à DexStudio Pro pour débloquer des tons illimités et des générations professionnelles.",
            upgradeBtn: "Passer Pro",
            communityFeedback: "Retours de la communauté",
            reviewPlaceholder: "Partagez votre avis sur l'outil...",
            submitReviewBtn: "Soumettre l'avis",
            noReviews: "Aucun commentaire pour le moment. Soyez le premier à donner votre avis !",
            justNow: "À l'instant",
            errorEmptyReview: "Veuillez entrer un commentaire et une note.",
            supportText: "L'outil vous aide ? Soutenez mon travail !",
            supportBtn: "☕ Offrez-moi un café pour soutenir ThreadPro"
        },
        en: {
            subtitle: "Enterprise Content-to-Thread SaaS",
            dashboard: "Dashboard",
            inputTitle: "Input Content",
            inputLabel: "Paste your article, blog post, or ideas",
            inputPlaceholder: "E.g., In recent years, artificial intelligence has fundamentally transformed how we interact with technology...",
            toneLabel: "Tone:",
            toneProfessional: "Professional",
            toneCreative: "Creative",
            toneHumorous: "Humorous",
            toneSarcastic: "Sarcastic",
            toneEducational: "Educational",
            toneMinimalist: "Minimalist",
            toneControversial: "Controversial",
            toneStoryteller: "Storyteller",
            toneUrgency: "Urgency",
            tonePhilosophical: "Philosophical",
            wordLimit: "~2500 words limit",
            generateBtn: "Generate Thread",
            previewTitle: "Thread Preview",
            copyBtn: "Copy Thread",
            footer: "© 2024 ThreadPro. Enterprise SaaS MVP.",
            errorEmpty: "Please enter some text.",
            generating: "Generating...",
            copied: "Copied!",
            limitReached: "Free limit reached (5/5)",
            upgradePrompt: "Upgrade to DexStudio Pro to unlock unlimited tones and professional generations.",
            upgradeBtn: "Upgrade Now",
            communityFeedback: "Community Feedback",
            reviewPlaceholder: "Share your thoughts on the tool...",
            submitReviewBtn: "Submit Review",
            noReviews: "No reviews yet. Be the first to share your thoughts!",
            justNow: "Just now",
            errorEmptyReview: "Please enter a comment and a rating.",
            supportText: "Is this tool helpful? Support my work!",
            supportBtn: "☕ Buy me a coffee to support ThreadPro"
        }
    };

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        // Update toggle button text to show the *other* language
        if (langToggleBtn) {
            langToggleBtn.innerText = lang === 'fr' ? 'EN' : 'FR';
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerText = translations[lang][key];
                }
            }
        });
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'fr' ? 'en' : 'fr';
            setLanguage(newLang);
        });
    }

    // Basic HTML sanitizer to prevent XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Helper to render thread items into the UI
    function renderThread(threadItems) {
        if (!threadContainer) return;

        // Clear existing items
        threadContainer.innerHTML = '';

        threadItems.forEach((text, index) => {
            const isLast = index === threadItems.length - 1;
            // Determine circle color based on index for a bit of variety (first is indigo, rest are slate)
            const circleColor = index === 0 ? 'bg-indigo-500' : 'bg-slate-700';

            // Escape HTML to prevent XSS, then format line breaks
            const formattedText = escapeHTML(text).replace(/\n/g, '<br>');

            const threadHtml = `
                <div class="relative pl-8 pb-6 border-l-2 border-slate-700/50 ${isLast ? 'last:border-0 last:pb-0' : ''} ml-2">
                    <div class="absolute w-4 h-4 ${circleColor} rounded-full -left-[9px] top-1 ring-4 ring-slate-800"></div>
                    <div class="thread-item rounded-xl p-4 shadow-sm">
                        <p class="text-sm text-slate-200 leading-relaxed">
                            ${formattedText}
                        </p>
                        <div class="mt-3 flex items-center gap-4 text-slate-500">
                            <i class="far fa-comment hover:text-indigo-400 cursor-pointer transition-colors"></i>
                            <i class="fas fa-retweet hover:text-green-400 cursor-pointer transition-colors"></i>
                            <i class="far fa-heart hover:text-pink-400 cursor-pointer transition-colors"></i>
                        </div>
                    </div>
                </div>
            `;

            threadContainer.insertAdjacentHTML('beforeend', threadHtml);
        });
    }

    // Tone simulation logic to show how it alters output
    function getTonePrefix(tone) {
        const tonePrefixes = {
            'Professional': '💼 [Professional]',
            'Creative': '🎨 [Creative]',
            'Humorous': '😂 [Humorous]',
            'Sarcastic': '😏 [Sarcastic]',
            'Educational': '📚 [Educational]',
            'Minimalist': '✨ [Minimalist]',
            'Controversial': '🔥 [Controversial]',
            'Storyteller': '📖 [Storyteller]',
            'Urgency': '⏰ [Urgency]',
            'Philosophical': '🤔 [Philosophical]'
        };
        return tonePrefixes[tone] || tonePrefixes['Professional'];
    }

    let generationCount = 0;
    const MAX_GENERATIONS = 5;

    if (contentForm) {
        contentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (generationCount >= MAX_GENERATIONS) {
                return; // Guard against form submission if limit reached (should be locked anyway)
            }

            const inputText = sourceContentInput ? sourceContentInput.value : '';
            const toneSelector = document.getElementById('tone-selector');
            const selectedTone = toneSelector ? toneSelector.value : 'Professional';

            if (!inputText.trim()) {
                alert(translations[currentLang].errorEmpty);
                return;
            }

            // Show a simple loading state on the button
            const submitBtn = contentForm.querySelector('button[type="submit"]') || contentForm.querySelector('button');
            const originalBtnHtml = submitBtn.innerHTML;
            if(submitBtn) {
                const generatingText = translations[currentLang].generating;
                submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${generatingText}`;
                submitBtn.disabled = true;
            }

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: inputText, tone: selectedTone })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erreur lors de la génération du thread.');
                }

                currentThread = data.threadItems;
                
                // Simulate tone behavior if the server doesn't support it natively yet
                // For demonstration, we prefix the first item with a tone indicator
                if (currentThread.length > 0) {
                    currentThread[0] = getTonePrefix(selectedTone) + ' ' + currentThread[0];
                }
                
                renderThread(currentThread);
                
                // Increment generation counter
                generationCount++;
                
                if (generationCount >= MAX_GENERATIONS) {
                    // Lock interface
                    if (toneSelector) {
                        toneSelector.disabled = true;
                        toneSelector.classList.add('opacity-50', 'cursor-not-allowed');
                    }
                    if (submitBtn) {
                        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
                        // Ensure we don't restore it to enabled
                    }
                    const usageBanner = document.getElementById('usage-limit-banner');
                    if (usageBanner) {
                        usageBanner.classList.remove('hidden');
                    }
                }

            } catch (error) {
                console.error('API Error:', error);
                renderThread([`❌ Erreur : ${error.message}`]);
                currentThread = [];
            } finally {
                // Restore button state if not locked
                if (submitBtn && generationCount < MAX_GENERATIONS) {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                } else if (submitBtn) {
                    // Keep the text but leave it disabled
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }

    // Interactive Stars Logic
    const interactiveStars = document.querySelectorAll('#interactive-stars i');
    let currentRating = 0;

    interactiveStars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            // Highlight up to the hovered star
            interactiveStars.forEach((s, i) => {
                if (i <= index) s.classList.add('hover-active');
                else s.classList.remove('hover-active');
            });
        });

        star.addEventListener('mouseout', () => {
            // Remove hover highlight
            interactiveStars.forEach(s => s.classList.remove('hover-active'));
        });

        star.addEventListener('click', () => {
            // Set active rating
            currentRating = index + 1;
            interactiveStars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('active');
                    s.classList.remove('text-slate-600');
                } else {
                    s.classList.remove('active');
                    s.classList.add('text-slate-600');
                }
            });
        });
    });
    
    // Review Submission Logic
    const submitReviewBtn = document.querySelector('[data-i18n="submitReviewBtn"]');
    const reviewInput = document.getElementById('review-input');
    const reviewsList = document.getElementById('reviews-list');
    const noReviewsMsg = document.getElementById('no-reviews-msg');
    
    let reviews = [];

    function renderReviews() {
        if (!reviewsList || !noReviewsMsg) return;
        
        // Remove all current reviews (but keep the no-reviews message for now)
        const currentReviewElements = reviewsList.querySelectorAll('.review-item');
        currentReviewElements.forEach(el => el.remove());

        if (reviews.length === 0) {
            noReviewsMsg.classList.remove('hidden');
        } else {
            noReviewsMsg.classList.add('hidden');
            
            reviews.forEach(review => {
                const starsHtml = Array(5).fill(0).map((_, i) => 
                    `<i class="fas fa-star ${i < review.rating ? 'text-pink-500' : 'text-slate-600'}"></i>`
                ).join('');

                const reviewHtml = `
                    <div class="review-item p-4 rounded-xl bg-white/5 border border-white/10 animate-fade-in">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">U</div>
                                <div>
                                    <p class="text-sm font-semibold text-white">Utilisateur</p>
                                    <p class="text-xs text-slate-400">${translations[currentLang].justNow}</p>
                                </div>
                            </div>
                            <div class="text-xs flex gap-1 review-stars">
                                ${starsHtml}
                            </div>
                        </div>
                        <p class="text-sm text-slate-300">${escapeHTML(review.text)}</p>
                    </div>
                `;
                reviewsList.insertAdjacentHTML('beforeend', reviewHtml);
            });
        }
    }

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', () => {
            const text = reviewInput ? reviewInput.value.trim() : '';
            if (!text || currentRating === 0) {
                alert(translations[currentLang].errorEmptyReview);
                return;
            }

            // Add to reviews array
            reviews.unshift({
                text: text,
                rating: currentRating,
                date: new Date()
            });

            // Clear input and rating
            reviewInput.value = '';
            currentRating = 0;
            interactiveStars.forEach(s => {
                s.classList.remove('active', 'text-pink-500');
                s.classList.add('text-slate-600');
            });

            renderReviews();
        });
    }

    // Initialize state
    renderReviews();

    // Copy Thread Functionality
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (currentThread.length === 0) return;

            // Join the thread items with double newlines
            const textToCopy = currentThread.join('\n\n');

            navigator.clipboard.writeText(textToCopy).then(() => {
                // Temporarily change button text to indicate success
                if (copyText) {
                    const originalText = copyText.innerText;
                    copyText.innerText = translations[currentLang].copied;
                    setTimeout(() => {
                        copyText.innerText = originalText;
                    }, 2000);
                }
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
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
    const cookieChoice = localStorage.getItem('threadpro-cookie-consent');
    
    if (!cookieChoice) {
        setTimeout(() => {
            if (cookieBanner) cookieBanner.classList.remove('translate-y-[200%]');
        }, 1500);
    }
    
    function saveConsent(preferences) {
        localStorage.setItem('threadpro-cookie-consent', JSON.stringify(preferences));
        if (cookieBanner) cookieBanner.classList.add('translate-y-[200%]');
        console.log('ThreadPro Cookies saved:', preferences);
    }

    // Accept All
    if (btnAccept) {
        btnAccept.addEventListener('click', () => {
            saveConsent({ technical: true, analytics: true });
        });
    }
    
    // Refuse All (except technical)
    if (btnRefuse) {
        btnRefuse.addEventListener('click', () => {
            saveConsent({ technical: true, analytics: false });
        });
    }
    
    // Open Customize Modal
    if (btnCustomize) {
        btnCustomize.addEventListener('click', () => {
            customizeModal.classList.remove('invisible', 'opacity-0');
            customizeModal.querySelector('.glass-card').classList.remove('scale-95');
        });
    }
    
    // Save Custom Preferences
    if (btnSavePref) {
        btnSavePref.addEventListener('click', () => {
            const analytics = document.getElementById('cookie-analytics').checked;
            saveConsent({ technical: true, analytics: analytics });
            closeAllModals();
        });
    }
    
    // Privacy Modal
    if (btnOpenPrivacy) {
        btnOpenPrivacy.addEventListener('click', () => {
            privacyModal.classList.remove('invisible', 'opacity-0');
            privacyModal.querySelector('.glass-card').classList.remove('scale-95');
        });
    }
    
    function closeAllModals() {
        [privacyModal, customizeModal].forEach(modal => {
            if (modal) {
                modal.classList.add('invisible', 'opacity-0');
                modal.querySelector('.glass-card').classList.add('scale-95');
            }
        });
    }

    // Close Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === privacyModal || e.target === customizeModal) closeAllModals();
    });
});
