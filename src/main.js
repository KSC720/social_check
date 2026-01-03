import './style.css'

// --- Navigation / Page Logic ---
let currentPage = 'home';
const pages = ['home', 'quiz', 'contact'];

document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    setupNavLinks();
    setupDonationRadios();
    setupCustomAmountToggle();
    setupSubjectOtherToggle();
    setupProfessionalOtherToggle();

    // Testimonial Shuffle
    const grid = document.getElementById('testimonial-grid');
    if (grid) {
        const cards = Array.from(grid.children);

        // Fisher–Yates shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        // Re-append shuffled cards
        cards.forEach(card => grid.appendChild(card));
    }
});

function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const page = link.dataset.page;
            const scrollTarget = link.dataset.scrollTarget;

            if (page) {
                e.preventDefault();
                showPage(page);
            } else if (scrollTarget) {
                e.preventDefault();
                showPage('home');
                const el = document.getElementById(scrollTarget);
                if (el) {
                    setTimeout(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                }
            }
        });
    });
}

function setActiveNav(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.dataset.page === pageId) {
            link.classList.add('nav-link-active');
        } else if (link.dataset.page) {
            link.classList.remove('nav-link-active');
        }
    });
}

// Make showPage available globally if needed by onclick handlers in HTML
window.showPage = function (pageId) {
    currentPage = pageId;

    // When opening the quiz page, reset and reshuffle questions
    if (pageId === 'quiz') {
        resetQuizView();
        renderQuiz();
    }

    pages.forEach(id => {
        const element = document.getElementById(id + '-page');
        if (element) {
            element.classList.toggle('hidden', id !== pageId);
        }
    });
    setActiveNav(pageId);
    window.scrollTo(0, 0); // Scroll to top on page change
}

// --- Scroll to top button visibility ---
const scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('hidden-btn');
        scrollTopBtn.classList.add('visible-btn');
    } else {
        scrollTopBtn.classList.add('hidden-btn');
        scrollTopBtn.classList.remove('visible-btn');
    }
});

// --- Quiz Logic ---
const quizQuestions = [
    {
        q: "How often do you check your phone within 5 minutes of waking up?",
        options: [
            { label: "A. Rarely/Never (I check after breakfast)", value: 'A' },
            { label: "B. Sometimes (After getting out of bed)", value: 'B' },
            { label: "C. Often (While still in bed)", value: 'C' },
            { label: "D. Immediately (It's the first thing I do)", value: 'D' }
        ]
    },
    {
        q: "If you forget your phone at home, how do you feel?",
        options: [
            { label: "A. Fine, I'll enjoy the break.", value: 'A' },
            { label: "B. Slightly annoyed, but manageable.", value: 'B' },
            { label: "C. Stressed/Anxious about missing something important.", value: 'C' },
            { label: "D. Panic/Need to go back and get it immediately.", value: 'D' }
        ]
    },
    {
        q: "How often do you scroll through social media when you are with friends or family?",
        options: [
            { label: "A. Rarely/Never, I put it away.", value: 'A' },
            { label: "B. Occasionally, only during quiet moments.", value: 'B' },
            { label: "C. Frequently, whenever there's a lull in conversation.", value: 'C' },
            { label: "D. Constantly, checking it even mid-sentence.", value: 'D' }
        ]
    },
    {
        q: "Do you check notifications while driving or crossing the street?",
        options: [
            { label: "A. Never, I keep it secured.", value: 'A' },
            { label: "B. Rarely, only when stopped at a light.", value: 'B' },
            { label: "C. Sometimes, I glance at it quickly.", value: 'C' },
            { label: "D. Often, I check it regardless of the situation.", value: 'D' }
        ]
    },
    {
        q: "How often do you lose sleep due to using your phone late at night?",
        options: [
            { label: "A. Never, I stick to a screen curfew.", value: 'A' },
            { label: "B. Sometimes, I lose less than 30 minutes of sleep.", value: 'B' },
            { label: "C. Often, I stay up 30-60 minutes past my bedtime.", value: 'C' },
            { label: "D. Almost every night, losing over an hour of sleep.", value: 'D' }
        ]
    },
    {
        q: "How often do you pick up your phone without a specific goal (just checking)?",
        options: [
            { label: "A. Rarely, I only use it for tasks.", value: 'A' },
            { label: "B. A few times a day.", value: 'B' },
            { label: "C. Many times an hour.", value: 'C' },
            { label: "D. Automatically, it feels constant and unconscious.", value: 'D' }
        ]
    },
    {
        q: "When eating a meal, where is your phone?",
        options: [
            { label: "A. Away/Silent, out of sight.", value: 'A' },
            { label: "B. On the table, face down.", value: 'B' },
            { label: "C. On the table, face up, I check notifications.", value: 'C' },
            { label: "D. In hand or propped up, watching content on it.", value: 'D' }
        ]
    },
    {
        q: "Do you feel a compulsive need to respond to messages or comments immediately?",
        options: [
            { label: "A. Never, I respond when it's convenient.", value: 'A' },
            { label: "B. Sometimes, if it's work-related.", value: 'B' },
            { label: "C. Often, I don't like to leave people waiting.", value: 'C' },
            { label: "D. Always, I feel anxious if I don't respond right away.", value: 'D' }
        ]
    },
    {
        q: "Has your productivity or attention span decreased due to phone use?",
        options: [
            { label: "A. No, I manage my time well.", value: 'A' },
            { label: "B. Slightly, on occasion.", value: 'B' },
            { label: "C. Moderately, I often struggle to focus on deep tasks.", value: 'C' },
            { label: "D. Significantly, my ability to concentrate is poor.", value: 'D' }
        ]
    },
    {
        q: "How long can you comfortably stay offline (voluntarily)?",
        options: [
            { label: "A. Days (I enjoy digital breaks)", value: 'A' },
            { label: "B. Several hours (During a movie or hobby)", value: 'B' },
            { label: "C. 1-2 hours (Then I feel a need to check)", value: 'C' },
            { label: "D. Less than 30 minutes (I constantly need to check)", value: 'D' }
        ]
    },
    {
        q: "Do you feel anxious if your phone battery is low or signal is poor?",
        options: [
            { label: "A. No, I don't worry about it.", value: 'A' },
            { label: "B. A little, but I quickly forget it.", value: 'B' },
            { label: "C. Moderately anxious, I need to find a charger/signal fast.", value: 'C' },
            { label: "D. Very stressed, it ruins my concentration (Nomophobia).", value: 'D' }
        ]
    },
    {
        q: "Do you often feel you 'miss out' (FOMO) if you don't check social media regularly?",
        options: [
            { label: "A. Never, I prioritize real life.", value: 'A' },
            { label: "B. Rarely, sometimes I see an interesting post.", value: 'B' },
            { label: "C. Sometimes, I feel like I'm not in the loop.", value: 'C' },
            { label: "D. Often, I feel anxious if I don't know what's happening online.", value: 'D' }
        ]
    },
    {
        q: "How often do you find yourself scrolling during real-life conversations?",
        options: [
            { label: "A. Never, I give full attention.", value: 'A' },
            { label: "B. Rarely, only for a necessary fact check.", value: 'B' },
            { label: "C. Occasionally, when the conversation gets boring.", value: 'C' },
            { label: "D. Often, I struggle to stay engaged without my phone.", value: 'D' }
        ]
    },
    {
        q: "Have others commented on your excessive screen time or asked you to put your phone away?",
        options: [
            { label: "A. Never.", value: 'A' },
            { label: "B. Once or twice, as a joke.", value: 'B' },
            { label: "C. A few times, indicating a genuine concern.", value: 'C' },
            { label: "D. Regularly, across different social circles.", value: 'D' }
        ]
    },
    {
        q: "Do you ever try to hide your screen usage from others (e.g., scrolling secretly)?",
        options: [
            { label: "A. Never, I have nothing to hide.", value: 'A' },
            { label: "B. Rarely, if I'm checking something sensitive.", value: 'B' },
            { label: "C. Sometimes, if I feel judged by others.", value: 'C' },
            { label: "D. Often, to avoid confrontation or being told off.", value: 'D' }
        ]
    },
    {
        q: "How often do you compare your looks, success, or lifestyle with people you see on Instagram, YouTube, or other apps?",
        options: [
            { label: "A. I rarely compare; I know social media isn’t real life.", value: 'A' },
            { label: "B. Sometimes I compare, but it doesn’t affect me much.", value: 'B' },
            { label: "C. Often – I feel behind or ‘less than’ when I see others online.", value: 'C' },
            { label: "D. Almost always – scrolling makes me feel like I’m failing at life.", value: 'D' }
        ]
    },
    {
        q: "Does social media make you doubt your own choices, personality, or value?",
        options: [
            { label: "A. No, I stay confident in who I am.", value: 'A' },
            { label: "B. Occasionally, I question myself for a moment.", value: 'B' },
            { label: "C. Quite often, I start doubting my looks, career, or relationships.", value: 'C' },
            { label: "D. Very often, I feel I’m not good enough compared to others online.", value: 'D' }
        ]
    },
    {
        q: "Do you try to copy trends, lifestyles, or activities you see online even if they don’t really fit you or your life?",
        options: [
            { label: "A. No, I just watch for fun without copying.", value: 'A' },
            { label: "B. Sometimes I try a trend, but it’s light and casual.", value: 'B' },
            { label: "C. Often, I feel pressure to dress, talk, or live like people I follow.", value: 'C' },
            { label: "D. Very often – I spend time or money I don’t have just to feel ‘up to date’.", value: 'D' }
        ]
    },
    {
        q: "After scrolling social media for a while, how do you usually feel inside?",
        options: [
            { label: "A. Mostly neutral or inspired – I feel okay.", value: 'A' },
            { label: "B. Sometimes a bit drained, but I recover quickly.", value: 'B' },
            { label: "C. Often I feel low, stressed, or like I’m not doing enough with my life.", value: 'C' },
            { label: "D. Very often I feel empty, worthless, or disconnected from myself and others.", value: 'D' }
        ]
    }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 🌍 Global quiz progress logic
function updateQuizProgress() {
    const form = document.getElementById('addiction-quiz');
    const label = document.getElementById('quiz-progress-label');
    const percentSpan = document.getElementById('quiz-progress-percent');
    const barInner = document.getElementById('quiz-progress-bar-inner');
    if (!form || !label || !percentSpan || !barInner) return;

    const totalQuestions = quizQuestions.length;
    const answered = form.querySelectorAll('input[type="radio"]:checked').length;
    const percent = Math.round((answered / totalQuestions) * 100);

    label.textContent = `${answered} of ${totalQuestions} answered`;
    percentSpan.textContent = `${percent}%`;
    barInner.style.width = `${percent}%`;
}

function setupGlobalQuizProgress() {
    const form = document.getElementById('addiction-quiz');
    if (!form) return;

    form.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', updateQuizProgress);
    });

    // Initial state
    updateQuizProgress();
}

function renderQuiz() {
    const form = document.getElementById('addiction-quiz');
    if (!form) return;
    form.innerHTML = '';

    const totalQuestions = quizQuestions.length;
    const shuffledQuestions = shuffleArray([...quizQuestions]);

    shuffledQuestions.forEach((qData, index) => {
        const qNum = index + 1;
        const progressPercent = Math.round((qNum / totalQuestions) * 100);

        const questionDiv = document.createElement('div');
        questionDiv.className = 'card hover-card p-6 rounded-2xl shadow-lg';
        questionDiv.innerHTML = `
            <!-- Question X of Y + tiny progress bar -->
            <div class="mb-3 flex items-center gap-3">
                <div class="text-xs sm:text-sm text-slate-400 font-medium">
                    Question <span class="text-teal-300">${qNum}</span>
                    <span class="mx-0.5 text-slate-500">/</span>
                    <span class="text-teal-300">${totalQuestions}</span>
                </div>
                <div class="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                        class="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-rose-400"
                        style="width: ${progressPercent}%;"
                    ></div>
                </div>
            </div>

            <p class="text-lg sm:text-xl font-semibold mb-4 text-teal-300">
                Q${qNum}: ${qData.q}
            </p>
            <div class="space-y-3">
                ${qData.options.map(option => `
                    <label class="flex items-start p-3 bg-gray-900/60 rounded-xl cursor-pointer hover:bg-gray-800/80 transition border border-slate-700/70">
                        <input type="radio" name="q${qNum}" value="${option.value}" required
                               class="mt-1 h-5 w-5 text-teal-500 focus:ring-amber-500 border-gray-600 bg-gray-900">
                        <span class="ml-3 text-gray-200 text-sm sm:text-base">${option.label}</span>
                    </label>
                `).join('')}
            </div>
        `;
        form.appendChild(questionDiv);
    });

    // Wire up global progress after we’ve inserted all inputs
    setupGlobalQuizProgress();
}

function resetQuizView() {
    const form = document.getElementById('addiction-quiz');
    const resultDiv = document.getElementById('quiz-result');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const finalWarning = document.getElementById('final-warning');
    const summaryDetails = document.getElementById('summary-details');
    const seekHelpCta = document.getElementById('seek-help-cta');

    if (form) {
        form.classList.remove('hidden');
    }
    if (submitBtn) {
        submitBtn.classList.remove('hidden');
    }
    if (resultDiv) {
        resultDiv.classList.add('hidden');
    }
    if (finalWarning) {
        finalWarning.className = 'mt-6 p-4 rounded-lg text-xl font-semibold border-l-4';
        finalWarning.innerHTML = '';
    }
    if (summaryDetails) {
        summaryDetails.innerHTML = '';
    }
    if (seekHelpCta) {
        seekHelpCta.classList.add('hidden');
    }
}

// Make globally available
window.submitQuiz = function () {
    const form = document.getElementById('addiction-quiz');
    const resultDiv = document.getElementById('quiz-result');
    const summaryDetails = document.getElementById('summary-details');
    const finalWarning = document.getElementById('final-warning');
    const seekHelpCta = document.getElementById('seek-help-cta');

    if (!form) return;

    // Reset visibility
    seekHelpCta.classList.add('hidden');
    const feedbackDiv = document.getElementById('form-feedback');
    if (feedbackDiv) {
        feedbackDiv.classList.add('hidden'); // Hide any previous contact feedback
    }

    // Check if all questions are answered
    let allAnswered = true;
    const answers = {};
    for (let i = 1; i <= quizQuestions.length; i++) {
        const selected = form.querySelector(`input[name="q${i}"]:checked`);
        if (!selected) {
            allAnswered = false;
            break;
        }
        answers[`q${i}`] = selected.value;
    }

    if (!allAnswered) {
        finalWarning.className = 'mt-6 p-5 sm:p-6 rounded-2xl text-base sm:text-lg font-semibold border-l-4 bg-rose-900/30 text-rose-100 border-rose-500 shadow-lg';
        finalWarning.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-3xl sm:text-4xl">🛑</span>
                <div>
                    <p class="font-bold text-lg sm:text-xl mb-1">Please answer all questions before submitting.</p>
                    <p class="font-normal text-sm sm:text-base text-gray-200 leading-relaxed">
                        Your honest responses help you see the full picture of how digital use is affecting your life.
                        Take a moment to go through each question with kindness towards yourself. 💙
                    </p>
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');
        document.getElementById('submit-quiz-btn').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // 1. Calculate scores
    const score = { A: 0, B: 0, C: 0, D: 0 };
    Object.values(answers).forEach(choice => {
        score[choice] = (score[choice] || 0) + 1;
    });

    const totalCD = score.C + score.D;
    const isHighlyAddicted = totalCD > 10;

    // 2. Display summary
    summaryDetails.innerHTML = `
        <div class="p-2 rounded-md bg-gray-800/60"><span class="font-bold text-teal-300">A Selections:</span> ${score.A}</div>
        <div class="p-2 rounded-md bg-gray-800/60"><span class="font-bold text-teal-300">B Selections:</span> ${score.B}</div>
        <div class="p-2 rounded-md bg-gray-800/60"><span class="font-bold text-teal-300">C Selections:</span> ${score.C}</div>
        <div class="p-2 rounded-md bg-gray-800/60"><span class="font-bold text-teal-300">D Selections:</span> ${score.D}</div>
        <div class="col-span-2 p-2 rounded-md bg-teal-900/40 font-bold text-xl text-teal-200">Total High-Risk (C+D): ${totalCD} / ${quizQuestions.length}</div>
    `;

    // 3. Display final result/warning
    if (isHighlyAddicted) {
        finalWarning.className = 'mt-6 p-5 sm:p-6 rounded-2xl text-base sm:text-lg font-semibold border-l-4 bg-rose-900/30 text-rose-100 border-rose-500 shadow-lg';
        finalWarning.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-4xl animate-subtle-shake">🚨</span>
                <div>
                    <p class="font-bold text-lg sm:text-xl mb-1">Wake-up Call: Your phone habits are starting to control your life.</p>
                    <p class="font-normal text-sm sm:text-base text-gray-200 leading-relaxed">
                        Your answers show strong signs of mobile / social media addiction. This doesn’t mean you are weak or broken —
                        it means your brain has been trained by apps that are <span class="font-semibold text-teal-300">built to be addictive</span>.
                    </p>
                    <ul class="mt-3 space-y-1.5 text-xs sm:text-sm font-normal text-gray-200">
                        <li>• You are <span class="font-semibold text-teal-300">not alone</span> — millions of people feel stuck in the same loop.</li>
                        <li>• Getting help is a sign of <span class="font-semibold text-teal-300">strength</span>, not failure.</li>
                        <li>• With the right support, your focus, mood and relationships can improve step by step. 🌱</li>
                    </ul>
                    <p class="mt-3 text-xs sm:text-sm font-normal text-gray-200">
                        Consider talking to someone you trust, or reaching out to us for your own plan to break free.
                        You don’t have to fight this battle alone. 💬💙
                    </p>
                </div>
            </div>
        `;
        seekHelpCta.classList.remove('hidden');
    } else if (totalCD >= 5) {
        finalWarning.className = 'mt-6 p-5 sm:p-6 rounded-2xl text-base sm:text-lg font-semibold border-l-4 bg-yellow-900/30 text-yellow-100 border-yellow-500 shadow-lg';
        finalWarning.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-3xl">💡</span>
                <div>
                    <p class="font-bold text-lg sm:text-xl mb-1">Be Careful: Your phone use is becoming a habit.</p>
                    <p class="font-normal text-sm sm:text-base text-gray-200 leading-relaxed">
                        Your results suggest that your phone and social media are starting to affect your focus, mood or self-esteem.
                        This is a <span class="font-semibold text-teal-300">great moment to take action</span> before it becomes heavier.
                    </p>
                    <ul class="mt-3 space-y-1.5 text-xs sm:text-sm font-normal text-gray-200">
                        <li>• Try creating “phone-free zones” (bedroom, meals, first 30 minutes after waking up).</li>
                        <li>• Notice when scrolling makes you compare, doubt yourself or feel empty — and gently close the app. 📵</li>
                        <li>• If this feels hard to do alone, guidance and accountability can really help.</li>
                    </ul>
                    <p class="mt-3 text-xs sm:text-sm font-normal text-gray-200">
                        You’re already doing something brave by checking in. Small changes now can protect your mental health
                        and relationships in the long run. 💚
                    </p>
                </div>
            </div>
        `;
    } else {
        finalWarning.className = 'mt-6 p-5 sm:p-6 rounded-2xl text-base sm:text-lg font-semibold border-l-4 bg-emerald-900/30 text-emerald-100 border-emerald-500 shadow-lg';
        finalWarning.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-3xl">✅</span>
                <div>
                    <p class="font-bold text-lg sm:text-xl mb-1">Looking Good: You have a healthy balance right now 🎉</p>
                    <p class="font-normal text-sm sm:text-base text-gray-200 leading-relaxed">
                        Your answers suggest that you currently have a relatively healthy relationship with your phone and social media.
                        You seem able to set limits and stay grounded in real life.
                    </p>
                    <ul class="mt-3 space-y-1.5 text-xs sm:text-sm font-normal text-gray-200">
                        <li>• Keep noticing how certain apps or content make you feel — especially around comparison and self-worth.</li>
                        <li>• Protect your habits by keeping device-free time for sleep, deep work and real conversations. 🧠</li>
                        <li>• You can share this test with someone who may be silently struggling.</li>
                    </ul>
                    <p class="mt-3 text-xs sm:text-sm font-normal text-gray-200">
                        Even strong boundaries need maintenance. Stay mindful, and adjust whenever you feel your peace or focus slipping. 🌿
                    </p>
                </div>
            </div>
        `;
    }

    // Show results and scroll to them
    form.classList.add('hidden');
    document.getElementById('submit-quiz-btn').classList.add('hidden');
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- Contact + Payment Logic (Google Sheet + Razorpay) ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMdtbwzI4ECiPQ4NYoRERyNla-SDXwwxHHgW0BsmbdNl3ZKB7v4DQVeyvH0J2w7BI4hw/exec';
const RAZORPAY_KEY_ID = 'rzp_test_RoJWhxfpulKfOB'; // TEST key – use LIVE key in production

function setupDonationRadios() {
    const donationRadios = document.querySelectorAll('input[name="Voluntary Support"]');
    donationRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const supportRadio = document.querySelector('input[name="engagement_type"][value=""]');
            if (supportRadio) supportRadio.checked = true;

            // Toggle custom amount field visibility
            const customAmountWrapper = document.getElementById('custom-amount-wrapper');
            if (customAmountWrapper) {
                if (radio.id === 'amount-custom-radio') {
                    customAmountWrapper.classList.remove('hidden');
                    const input = document.getElementById('custom-amount-input');
                    if (input) input.required = true;
                } else {
                    customAmountWrapper.classList.add('hidden');
                    const input = document.getElementById('custom-amount-input');
                    if (input) input.required = false;
                }
            }
        });
    });
}

function setupCustomAmountToggle() {
    // This is mostly handled inside setupDonationRadios now, 
    // but we can add more logic here if needed.
}

function setupSubjectOtherToggle() {
    const subjectSelect = document.getElementById('subject');
    const otherWrapper = document.getElementById('subject-other-wrapper');
    const otherInput = document.getElementById('subject-other');

    if (subjectSelect && otherWrapper && otherInput) {
        subjectSelect.addEventListener('change', () => {
            if (subjectSelect.value === 'other') {
                otherWrapper.classList.remove('hidden');
                otherInput.required = true;
                otherInput.focus();
            } else {
                otherWrapper.classList.add('hidden');
                otherInput.required = false;
            }
        });
    }
}

function setupProfessionalOtherToggle() {
    const profSelect = document.getElementById('professional');
    const otherWrapper = document.getElementById('prof-other-wrapper');
    const otherInput = document.getElementById('prof-other');

    if (profSelect && otherWrapper && otherInput) {
        profSelect.addEventListener('change', () => {
            if (profSelect.value === 'other') {
                otherWrapper.classList.remove('hidden');
                otherInput.required = true;
                otherInput.focus();
            } else {
                otherWrapper.classList.add('hidden');
                otherInput.required = false;
            }
        });
    }
}

function getPaymentAmountRupees(engagementType) {
    if (engagementType === '') {
        const donationChoice = document.querySelector('input[name="Voluntary Support"]:checked');
        if (donationChoice) {
            if (donationChoice.value === 'custom') {
                const customInput = document.getElementById('custom-amount-input');
                const val = parseInt(customInput?.value, 10);
                return isNaN(val) ? 0 : val;
            }
            const value = parseInt(donationChoice.value, 10);
            return isNaN(value) ? 0 : value;
        }
        return 0;
    } else if (engagementType === 'consult_1_1') {
        return 1499;
    }
    return 0;
}

function getPaymentDescription(engagementType) {
    if (engagementType === '') {
        return 'Fuel the Digital Detox Mission';
    } else if (engagementType === 'consult_1_1') {
        return '1:1 Mobile/Screen Addiction Consultation';
    }
    return 'Digital Detox Support';
}

function setContactButtonLoading(isLoading, labelText) {
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = document.getElementById('contact-submit-text');
    const spinner = document.getElementById('contact-loading-spinner');

    if (!submitBtn || !submitText || !spinner) return;

    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-90', 'cursor-not-allowed');
        submitText.textContent = labelText || 'Please wait...';
        spinner.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-90', 'cursor-not-allowed');
        submitText.textContent = 'Send Details / Continue';
        spinner.classList.add('hidden');
    }
}

async function sendFormToGoogleSheet(form, extraFields) {
    const formData = new FormData(form);
    if (extraFields && typeof extraFields === 'object') {
        Object.entries(extraFields).forEach(([key, value]) => {
            formData.set(key, value);
        });
    }

    await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    });
}

function openRazorpayCheckout(config) {
    const {
        nameValue,
        emailValue,
        phoneValue,
        amountPaise,
        amountRupees,
        engagementType,
        onSuccess,
        onFailureOrCancel
    } = config;

    if (typeof Razorpay === 'undefined') {
        console.error('Razorpay script not loaded');
        if (typeof onFailureOrCancel === 'function') onFailureOrCancel();
        return;
    }

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: 'INR',
        name: 'Digital Detox',
        description: getPaymentDescription(engagementType),
        prefill: {
            name: nameValue,
            email: emailValue,
            contact: phoneValue
        },
        theme: {
            color: '#F59E0B'
        },
        handler: function (response) {
            if (typeof onSuccess === 'function') {
                onSuccess(response);
            }
        },
        modal: {
            ondismiss: function () {
                if (typeof onFailureOrCancel === 'function') {
                    onFailureOrCancel();
                }
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

// Make globally available
window.handleContactAndPayment = async function (event) {
    console.log("Submit triggered");
    if (event) event.preventDefault();

    const form = document.getElementById('contact-form');
    const feedbackDiv = document.getElementById('form-feedback');
    if (!form) return;

    if (feedbackDiv) {
        feedbackDiv.classList.add('hidden');
    }

    // HTML5 field validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const engagementRadio = document.querySelector('input[name="engagement_type"]:checked');
    if (!engagementRadio) {
        if (feedbackDiv) {
            feedbackDiv.classList.remove('hidden');
            feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-red-900/40 text-red-300';
            feedbackDiv.innerHTML = 'Please choose how you would like to engage (Contact only / Support / Consultation).';
        }
        return;
    }

    const engagementType = engagementRadio.value;
    const nameValue = (form.querySelector('#name')?.value || '').trim() || 'Friend';
    const emailValue = (form.querySelector('#email')?.value || '').trim();
    const phoneValue = (form.querySelector('#phone')?.value || '').trim();

    // Determine final subject and professional info
    let subjectValue = (form.querySelector('#subject')?.value || '');
    if (subjectValue === 'other') {
        subjectValue = (form.querySelector('#subject-other')?.value || '').trim() || 'Other';
    }

    let professionalValue = (form.querySelector('#professional')?.value || '');
    if (professionalValue === 'other') {
        professionalValue = (form.querySelector('#prof-other')?.value || '').trim() || 'Other Profession';
    }

    // Contact only – no payment
    if (engagementType === 'contact_only') {
        setContactButtonLoading(true, 'Securing your digital detox request...');
        if (feedbackDiv) {
            feedbackDiv.classList.remove('hidden');
            feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-blue-900/40 text-blue-300';
            feedbackDiv.innerHTML = 'Connecting to our detox mission... Please wait...';
        }

        try {
            await sendFormToGoogleSheet(form, {
                subject: subjectValue,
                professional: professionalValue,
                engagement_type: 'contact_only',
                payment_status: 'NO_PAYMENT',
                payment_amount: 0,
                payment_id: ''
            });

            if (feedbackDiv) {
                feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-green-900/40 text-green-300';
                feedbackDiv.innerHTML = '✅ Success! Your mission starts here.';
            }

            showSuccessModal(nameValue);
            form.reset();
        } catch (error) {
            console.error(error);
            if (feedbackDiv) {
                feedbackDiv.classList.remove('hidden');
                feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-red-900/40 text-red-300';
                feedbackDiv.innerHTML = '❌ Something went wrong. Please try again later.';
            }
        } finally {
            setContactButtonLoading(false);
        }

        return;
    }

    // Paid options
    const amountRupees = getPaymentAmountRupees(engagementType);
    if (!amountRupees || amountRupees <= 0) {
        if (feedbackDiv) {
            feedbackDiv.classList.remove('hidden');
            feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-red-900/40 text-red-300';
            feedbackDiv.innerHTML = 'Please select an amount for your support / donation.';
        }
        return;
    }

    const amountPaise = amountRupees * 100;

    setContactButtonLoading(true, 'Opening secure payment...');
    if (feedbackDiv) {
        feedbackDiv.classList.remove('hidden');
        feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-blue-900/40 text-blue-300';
        feedbackDiv.innerHTML = 'Opening secure Razorpay payment window...';
    }

    openRazorpayCheckout({
        nameValue,
        emailValue,
        phoneValue,
        amountPaise,
        amountRupees,
        engagementType,
        onSuccess: async (response) => {
            if (feedbackDiv) {
                feedbackDiv.classList.remove('hidden');
                feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-green-900/40 text-green-300';
                feedbackDiv.innerHTML = `✅ Payment successful (TEST MODE). Payment ID: ${response.razorpay_payment_id || ''}`;
            }

            setContactButtonLoading(true, 'Finalizing your mission details...');
            try {
                // AWAIT SYNC: Ensure 100% data reliability before showing success
                await sendFormToGoogleSheet(form, {
                    subject: subjectValue,
                    professional: professionalValue,
                    engagement_type: engagementType,
                    payment_status: 'PAID_TEST',
                    payment_amount: amountRupees,
                    payment_currency: 'INR',
                    payment_id: response.razorpay_payment_id || ''
                });

                showSuccessModal(nameValue);
                form.reset();
            } catch (error) {
                console.error(error);
                if (feedbackDiv) {
                    feedbackDiv.classList.remove('hidden');
                    feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-yellow-900/40 text-yellow-200';
                    feedbackDiv.innerHTML = 'Payment was successful, but saving your details seems to have failed. Please contact us directly if you do not hear back.';
                }
            } finally {
                setContactButtonLoading(false);
            }
        },
        onFailureOrCancel: () => {
            if (feedbackDiv) {
                feedbackDiv.classList.remove('hidden');
                feedbackDiv.className = 'mt-4 p-3 rounded-lg text-center bg-red-900/40 text-red-300';
                feedbackDiv.innerHTML = 'Payment was not completed. You can try again, or choose "Just contact" to send a message without payment.';
            }
            setContactButtonLoading(false);
        }
    });
}

// --- Success Modal helpers ---
window.showSuccessModal = function (name) {
    const modal = document.getElementById('success-modal');
    const nameSpan = document.getElementById('success-name');
    if (nameSpan) {
        nameSpan.textContent = name;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Auto-close after 18 seconds if user doesn't click
    setTimeout(() => {
        if (!modal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    }, 18000);
}

window.closeSuccessModal = function () {
    const modal = document.getElementById('success-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}
