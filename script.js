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

// Helper to detect if a string is a video URL
function isVideoUrl(str) {
    const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|tiktok\.com|instagram\.com).+$/i;
    return urlPattern.test(str.trim());
}

// Mock function to simulate generating a thread from a video URL or text
function generateMockThread(input) {
    const trimmedInput = input.trim();

    // Check if it's a known video URL
    if (isVideoUrl(trimmedInput)) {
        let platform = "Video";
        if (trimmedInput.includes("youtube") || trimmedInput.includes("youtu.be")) platform = "YouTube";
        if (trimmedInput.includes("tiktok")) platform = "TikTok";
        if (trimmedInput.includes("instagram")) platform = "Instagram";

        return [
            `1/ Just watched an incredible ${platform} video and had to break it down. 🧵 Here are the key takeaways you need to know. 👇`,
            `2/ The creator started by addressing a massive problem we all face, but framed it in a completely new way. Instead of focusing on the symptoms, they dove straight into the root cause. 🤯`,
            `3/ The turning point was when they introduced their core framework. It's shockingly simple: Consistency > Intensity. They showed real examples of how small daily actions compound over time. 📈`,
            `4/ One of the most counterintuitive points: "Stop trying to optimize everything." Sometimes the best way to move forward is to embrace the messy middle and just keep executing. 💡`,
            `5/ TL;DR: \n- Focus on root causes, not symptoms\n- Consistency beats intensity\n- Embrace the messy middle\n\nWhat are your thoughts on this approach? Drop a reply below! 👇`
        ];
    }

    // Default mock response for generic text
    if (trimmedInput.length === 0) {
        return ["Please enter some text or a video URL to generate a thread!"];
    }

    return [
        `1/ Here is a summary of the text you provided. The main idea is fascinating and definitely worth a deep dive. 🧵👇`,
        `2/ The first key point highlights the importance of understanding the foundational concepts before jumping into complex implementations. 🏗️`,
        `3/ Furthermore, the text emphasizes that adaptability is crucial in today's fast-paced environment. Those who pivot quickly win. ⚡`,
        `4/ In conclusion, it's all about executing on these core principles consistently. Thanks for reading this thread! Retweet to share with your audience. 🚀`
    ];
}

// Application Logic
document.addEventListener('DOMContentLoaded', () => {
    const contentForm = document.getElementById('content-form');
    const sourceContentInput = document.getElementById('source-content');
    const threadContainer = document.getElementById('thread-container');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = document.getElementById('copy-text');

    let currentThread = [];

    // Helper to render thread items into the UI
    function renderThread(threadItems) {
        if (!threadContainer) return;

        // Clear existing items
        threadContainer.innerHTML = '';

        threadItems.forEach((text, index) => {
            const isLast = index === threadItems.length - 1;
            // Determine circle color based on index for a bit of variety (first is indigo, rest are slate)
            const circleColor = index === 0 ? 'bg-indigo-500' : 'bg-slate-700';

            // Format line breaks in text for HTML
            const formattedText = text.replace(/\n/g, '<br>');

            const threadHtml = `
                <div class="relative pl-8 pb-6 border-l-2 border-slate-700/50 ${isLast ? 'last:border-0 last:pb-0' : ''} ml-2">
                    <div class="absolute w-4 h-4 ${circleColor} rounded-full -left-[9px] top-1 ring-4 ring-slate-800"></div>
                    <div class="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 shadow-sm hover:border-slate-600/50 transition-colors">
                        <p class="text-sm text-slate-200 leading-relaxed">
                            ${formattedText}
                        </p>
                        <div class="mt-3 flex items-center gap-4 text-slate-500">
                            <svg class="w-4 h-4 hover:text-indigo-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            <svg class="w-4 h-4 hover:text-green-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            <svg class="w-4 h-4 hover:text-pink-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                    </div>
                </div>
            `;

            threadContainer.insertAdjacentHTML('beforeend', threadHtml);
        });
    }

    if (contentForm) {
        contentForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const inputText = sourceContentInput ? sourceContentInput.value : '';

            // Show a simple loading state on the button
            const submitBtn = contentForm.querySelector('button[type="submit"]') || contentForm.querySelector('button');
            const originalBtnHtml = submitBtn.innerHTML;
            if(submitBtn) {
                submitBtn.innerHTML = 'Generating...';
                submitBtn.disabled = true;
            }

            // Simulate a brief API delay
            setTimeout(() => {
                currentThread = generateMockThread(inputText);
                renderThread(currentThread);

                // Restore button state
                if(submitBtn) {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                }
            }, 800);
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
                    copyText.innerText = 'Copied!';
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
