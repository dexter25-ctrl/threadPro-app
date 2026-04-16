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
            toneEngaging: "Engageant",
            toneAnalytical: "Analytique",
            wordLimit: "Limite de ~2500 mots",
            generateBtn: "Générer le Thread",
            previewTitle: "Aperçu du Thread",
            copyBtn: "Copier le Thread",
            footer: "© 2024 ThreadPro. Enterprise SaaS MVP.",
            errorEmpty: "Veuillez entrer du texte.",
            generating: "Génération...",
            copied: "Copié !"
        },
        en: {
            subtitle: "Enterprise Content-to-Thread SaaS",
            dashboard: "Dashboard",
            inputTitle: "Input Content",
            inputLabel: "Paste your article, blog post, or ideas",
            inputPlaceholder: "E.g., In recent years, artificial intelligence has fundamentally transformed how we interact with technology...",
            toneLabel: "Tone:",
            toneProfessional: "Professional",
            toneEngaging: "Engaging",
            toneAnalytical: "Analytical",
            wordLimit: "~2500 words limit",
            generateBtn: "Generate Thread",
            previewTitle: "Thread Preview",
            copyBtn: "Copy Thread",
            footer: "© 2024 ThreadPro. Enterprise SaaS MVP.",
            errorEmpty: "Please enter some text.",
            generating: "Generating...",
            copied: "Copied!"
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

    if (contentForm) {
        contentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const inputText = sourceContentInput ? sourceContentInput.value : '';

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
                const response = await fetch('http://localhost:3000/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: inputText })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erreur lors de la génération du thread.');
                }

                currentThread = data.threadItems;
                renderThread(currentThread);

            } catch (error) {
                console.error('API Error:', error);
                renderThread([`❌ Erreur : ${error.message}`]);
                currentThread = [];
            } finally {
                // Restore button state
                if(submitBtn) {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                }
            }
        });
    }

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
});
