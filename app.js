/**
 * Astha's Birthday Quiz - Interactive Web Application
 * Handles Quiz flow, Photo Reveals, Web Audio Synthesizer,
 * Confetti Particle Physics, and Birthday Interactive Cake.
 */

// ============================================================================
// 1. QUIZ DATA
// ============================================================================
const quizData = [
    {
        id: 1,
        question: 'Before she was officially "Astha," what name did her parents originally plan for her when she started school?',
        options: ['Anukriti', 'Kavya', 'Shruti', 'Meera'],
        correctAnswer: 'Anukriti',
        image: 'https://i.postimg.cc/brpR75m2/IMG-8969.jpg',
        alt: 'Astha Q1',
        caption: 'The original name meant "a work of art / creation"—before she blossomed into our one and only Astha! 🌸✨',
        title: 'Chapter 1: The School Days Name'
    },
    {
        id: 2,
        question: 'Astha had a childhood friend whose nickname was after a famous freedom fighter. Can you guess who that freedom fighter was?',
        options: ['Bhagat Singh', 'Abha Sharma', 'Anukriti Thakur', 'Ozzy Joshi'],
        correctAnswer: 'Bhagat Singh',
        image: 'https://i.postimg.cc/Y0Mx5PdW/IMG-8968.jpg',
        alt: 'Astha Q2',
        caption: 'Shaheed Bhagat Singh! Childhood friendships and rebellious mischief that will never be forgotten! 🇮🇳✌️',
        title: 'Chapter 2: The Freedom Fighter Friend'
    },
    {
        id: 3,
        question: 'Where did Astha graduate from?',
        options: ['Panjab University, Chandigarh', 'Delhi University, New Delhi', 'Christ University, Bangalore', 'Mumbai University, Mumbai'],
        correctAnswer: 'Panjab University, Chandigarh',
        image: 'https://i.postimg.cc/5ybmhrsv/IMG-8967.jpg',
        alt: 'Astha Q3',
        caption: 'Panjab University, Chandigarh! The unforgettable Chandigarh days full of ambition, canteen laughter, and lifelong memories 🎓🌟',
        title: 'Chapter 3: Campus Chronicles'
    },
    {
        id: 4,
        question: 'On what date did Astha and Anshul officially get engaged?',
        options: ['4th October 2025', '11th October 2025', '18th October 2025', '25th October 2025'],
        correctAnswer: '4th October 2025',
        image: 'https://i.postimg.cc/x8nPwZ6M/IMG-8961.jpg',
        alt: 'Astha Q4',
        caption: '4th October 2025! The magical day sealed with forever rings, endless love, and gorgeous smiles 💍💖',
        title: 'Chapter 4: The Official Engagement'
    },
    {
        id: 5,
        question: 'Who (or what) does Astha truly love the most?',
        options: ['Times Internet', 'Anshul', 'Food', 'Dark Chocolate'],
        correctAnswer: 'Times Internet',
        image: 'https://i.postimg.cc/Zn4LGQwn/IMG-8966.jpg',
        alt: 'Astha Q5',
        caption: 'A legendary corporate devotion! Times Internet holds the golden crown in Astha\'s heart 💼👑',
        specialNote: 'Sorry Anshul, you are a close second.',
        title: 'Chapter 5: Her Truest Love'
    }
];

// ============================================================================
// 2. WEB AUDIO SYNTHESIZER (Pure JS - Zero External Assets)
// ============================================================================
class SoundEffects {
    constructor() {
        this.enabled = true;
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playCorrectChime() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Tri-tone joyous bell chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.001, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.5);
        });
    }

    playWrongBoop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    playBlowingSound() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const bufferSize = this.ctx.sampleRate * 0.6;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.5);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }

    playFanfare() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        fanfareNotes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);

            gain.gain.setValueAtTime(0.001, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.12 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.65);
        });
    }
}

const sfx = new SoundEffects();

// ============================================================================
// 3. CONFETTI PARTICLE SYSTEM (High Performance Canvas Particle Physics)
// ============================================================================
class ConfettiEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.colors = ['#ff2a85', '#ffbe0b', '#06d6a0', '#8338ec', '#3a86ff', '#ff758f', '#ffe494'];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 90) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 12 + 4;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                size: Math.random() * 9 + 5,
                shape: Math.random() > 0.4 ? 'rect' : 'circle',
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                decay: Math.random() * 0.015 + 0.008
            });
        }
        if (!this.animationId) {
            this.animate();
        }
    }

    continuousShower(durationMs = 4000) {
        const interval = setInterval(() => {
            this.burst(Math.random() * this.width, Math.random() * this.height * 0.4, 30);
        }, 300);

        setTimeout(() => {
            clearInterval(interval);
        }, durationMs);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.28; // gravity
            p.vx *= 0.98; // air drag
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;

            if (p.opacity <= 0 || p.y > this.height) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }
}

const confetti = new ConfettiEngine('confetti-canvas');

// ============================================================================
// 4. QUIZ STATE & DOM CONTROLLER
// ============================================================================
class BirthdayQuizApp {
    constructor() {
        this.currentIndex = 0;
        this.isRevealed = false;
        this.candlesBlown = false;

        this.cacheDOM();
        this.bindEvents();
        this.preloadImages();
    }

    cacheDOM() {
        // Screens
        this.introScreen = document.getElementById('intro-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.finaleScreen = document.getElementById('finale-screen');

        // Top controls
        this.soundBtn = document.getElementById('sound-toggle-btn');
        this.soundIcon = document.getElementById('sound-icon');
        this.startBtn = document.getElementById('start-quiz-btn');

        // Progress elements
        this.progressText = document.getElementById('progress-text');
        this.progressFill = document.getElementById('progress-fill');
        this.progressPill = document.getElementById('progress-indicator-pill');
        this.milestoneSteps = document.getElementById('milestone-steps');

        // Question card elements
        this.questionTag = document.getElementById('question-tag');
        this.questionText = document.getElementById('question-text');
        this.optionsGrid = document.getElementById('options-grid');
        this.feedbackBanner = document.getElementById('feedback-banner');

        // Photo reveal elements
        this.photoRevealCard = document.getElementById('photo-reveal-card');
        this.revealedPhoto = document.getElementById('revealed-photo');
        this.imgSkeleton = document.getElementById('img-skeleton');
        this.q5SpecialCallout = document.getElementById('q5-special-callout');
        this.polaroidCaption = document.getElementById('polaroid-caption');
        this.nextQuestionBtn = document.getElementById('next-question-btn');
        this.nextBtnText = document.getElementById('next-btn-text');

        // Finale elements
        this.cakeStage = document.getElementById('cake-stage');
        this.blowCandlesBtn = document.getElementById('blow-candles-btn');
        this.wishMessageBox = document.getElementById('wish-message-box');
        this.galleryGrid = document.getElementById('gallery-grid');
        this.replayQuizBtn = document.getElementById('replay-quiz-btn');
        this.confettiBoostBtn = document.getElementById('confetti-boost-btn');
    }

    bindEvents() {
        // Sound toggle
        this.soundBtn.addEventListener('click', () => this.toggleSound());

        // Start Quiz
        this.startBtn.addEventListener('click', () => {
            sfx.playClick();
            this.showScreen(this.quizScreen);
            this.renderQuestion(0);
        });

        // Next Question Button
        this.nextQuestionBtn.addEventListener('click', () => {
            sfx.playClick();
            if (this.currentIndex < quizData.length - 1) {
                this.currentIndex++;
                this.renderQuestion(this.currentIndex);
            } else {
                this.showFinale();
            }
        });

        // Cake Interactions
        this.blowCandlesBtn.addEventListener('click', () => this.blowCandles());
        this.cakeStage.addEventListener('click', () => this.blowCandles());

        // Replay & Confetti boost
        this.replayQuizBtn.addEventListener('click', () => this.restartQuiz());
        this.confettiBoostBtn.addEventListener('click', () => {
            sfx.playClick();
            confetti.continuousShower(2500);
        });
    }

    preloadImages() {
        quizData.forEach(q => {
            const img = new Image();
            img.src = q.image;
        });
    }

    toggleSound() {
        sfx.enabled = !sfx.enabled;
        if (sfx.enabled) {
            this.soundIcon.className = 'fa-solid fa-volume-high';
            this.soundBtn.classList.remove('active-muted');
            this.soundBtn.querySelector('.sound-label').textContent = 'Sound ON';
            sfx.playClick();
        } else {
            this.soundIcon.className = 'fa-solid fa-volume-xmark';
            this.soundBtn.classList.add('active-muted');
            this.soundBtn.querySelector('.sound-label').textContent = 'Sound OFF';
        }
    }

    showScreen(targetScreen) {
        [this.introScreen, this.quizScreen, this.finaleScreen].forEach(screen => {
            screen.classList.remove('active');
        });
        targetScreen.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateProgress(index) {
        const total = quizData.length;
        const currentNum = index + 1;
        const percent = (currentNum / total) * 100;

        this.progressText.textContent = `Question ${currentNum} of ${total}`;
        this.progressPill.textContent = `Memory #${currentNum}`;
        this.progressFill.style.width = `${percent}%`;

        // Update step dots
        const dots = this.milestoneSteps.querySelectorAll('.step-dot');
        dots.forEach((dot, dotIdx) => {
            dot.classList.remove('active', 'completed');
            if (dotIdx < index) {
                dot.classList.add('completed');
                dot.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else if (dotIdx === index) {
                dot.classList.add('active');
                dot.textContent = dotIdx + 1;
            } else {
                dot.textContent = dotIdx + 1;
            }
        });
    }

    renderQuestion(index) {
        this.currentIndex = index;
        this.isRevealed = false;
        const q = quizData[index];

        this.updateProgress(index);

        // Header and Question
        this.questionTag.textContent = `✨ Question ${index + 1}`;
        this.questionText.textContent = q.question;

        // Reset feedback & photo reveal
        this.feedbackBanner.className = 'feedback-banner';
        this.feedbackBanner.innerHTML = '';
        this.photoRevealCard.classList.remove('revealed');
        this.revealedPhoto.classList.remove('loaded');
        this.imgSkeleton.classList.remove('hidden');

        // Check if Question 5
        if (index === 4) {
            this.q5SpecialCallout.classList.remove('hidden');
        } else {
            this.q5SpecialCallout.classList.add('hidden');
        }

        // Render Option Cards
        this.optionsGrid.innerHTML = '';
        const letters = ['A', 'B', 'C', 'D'];

        q.options.forEach((optText, i) => {
            const card = document.createElement('button');
            card.className = 'option-card';
            card.type = 'button';
            card.setAttribute('role', 'radio');
            card.setAttribute('aria-checked', 'false');
            card.setAttribute('data-answer', optText);

            card.innerHTML = `
                <div class="option-badge">${letters[i] || (i + 1)}</div>
                <div class="option-text">${optText}</div>
            `;

            card.addEventListener('click', (e) => this.handleOptionClick(card, optText, q));
            this.optionsGrid.appendChild(card);
        });

        // Set Next Button label
        if (index === quizData.length - 1) {
            this.nextBtnText.textContent = 'See Birthday Finale! 🎂🎉';
        } else {
            this.nextBtnText.textContent = 'Next Question';
        }

        // Smooth scroll to top of quiz screen
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleOptionClick(clickedCard, selectedAnswer, questionObj) {
        if (this.isRevealed) return; // Already revealed

        if (selectedAnswer === questionObj.correctAnswer) {
            // ============================================
            // CORRECT ANSWER
            // ============================================
            this.isRevealed = true;
            sfx.playCorrectChime();

            // Highlight chosen option
            clickedCard.classList.add('correct');
            clickedCard.setAttribute('aria-checked', 'true');

            // Disable all other options
            const allCards = this.optionsGrid.querySelectorAll('.option-card');
            allCards.forEach(c => {
                if (c !== clickedCard) c.classList.add('disabled');
            });

            // Feedback Banner
            this.feedbackBanner.className = 'feedback-banner show success';
            this.feedbackBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> Bingo! That is 100% correct! 🎉`;

            // Trigger Confetti
            const rect = clickedCard.getBoundingClientRect();
            confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 75);

            // Reveal Image & Next Button
            this.revealPhoto(questionObj);

        } else {
            // ============================================
            // WRONG ANSWER
            // ============================================
            sfx.playWrongBoop();

            clickedCard.classList.add('wrong');
            setTimeout(() => {
                clickedCard.classList.remove('wrong');
            }, 600);

            // Encouraging feedback
            this.feedbackBanner.className = 'feedback-banner show error';
            this.feedbackBanner.innerHTML = `<i class="fa-solid fa-face-laugh-wink"></i> Oops! Nice try, guess again! 😉`;
        }
    }

    revealPhoto(questionObj) {
        // Set photo source and metadata
        this.revealedPhoto.alt = questionObj.alt;
        this.polaroidCaption.textContent = questionObj.caption;

        // Image loading logic
        this.revealedPhoto.onload = () => {
            this.imgSkeleton.classList.add('hidden');
            this.revealedPhoto.classList.add('loaded');
        };

        // If image was already cached
        this.revealedPhoto.src = questionObj.image;
        if (this.revealedPhoto.complete) {
            this.imgSkeleton.classList.add('hidden');
            this.revealedPhoto.classList.add('loaded');
        }

        // Show card with smooth animation
        this.photoRevealCard.classList.add('revealed');

        // Smooth scroll to the photo card so user sees it right away
        setTimeout(() => {
            this.photoRevealCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
    }

    showFinale() {
        this.showScreen(this.finaleScreen);
        sfx.playFanfare();
        confetti.continuousShower(3500);

        // Populate Memory Wall Gallery with all 5 photos
        this.renderGallery();
    }

    renderGallery() {
        this.galleryGrid.innerHTML = '';
        quizData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gallery-item';
            
            let q5Html = '';
            if (item.id === 5) {
                q5Html = `
                    <div class="gallery-q5-highlight">
                        "Sorry Anshul, you are a close second." 😜❤️
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="gallery-img-wrap">
                    <img src="${item.image}" alt="${item.alt}" loading="lazy">
                </div>
                <div class="gallery-item-title">${item.title}</div>
                <div class="gallery-item-desc">${item.caption}</div>
                ${q5Html}
            `;
            this.galleryGrid.appendChild(card);
        });
    }

    blowCandles() {
        if (this.candlesBlown) return;
        this.candlesBlown = true;

        sfx.playBlowingSound();

        // Extinguish flames
        const flames = [
            document.getElementById('flame-1'),
            document.getElementById('flame-2'),
            document.getElementById('flame-3')
        ];
        flames.forEach(f => f && f.classList.add('blown-out'));

        // Confetti burst
        confetti.continuousShower(3000);

        // Update button text & show wish message
        this.blowCandlesBtn.innerHTML = `<span>✨ Candles Blown! Wish Made! 💖</span>`;
        this.blowCandlesBtn.classList.remove('pulse-btn');
        this.blowCandlesBtn.disabled = true;

        const instruction = document.getElementById('cake-instruction');
        if (instruction) instruction.textContent = 'Your wish has been released into the stars! ✨';

        this.wishMessageBox.classList.remove('hidden');

        setTimeout(() => {
            this.wishMessageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
    }

    restartQuiz() {
        sfx.playClick();
        this.currentIndex = 0;
        this.isRevealed = false;
        this.candlesBlown = false;

        // Reset cake
        const flames = [
            document.getElementById('flame-1'),
            document.getElementById('flame-2'),
            document.getElementById('flame-3')
        ];
        flames.forEach(f => f && f.classList.remove('blown-out'));

        this.blowCandlesBtn.innerHTML = `<span>💨 Blow Out The Candles!</span>`;
        this.blowCandlesBtn.classList.add('pulse-btn');
        this.blowCandlesBtn.disabled = false;
        this.wishMessageBox.classList.add('hidden');

        // Go to quiz screen
        this.showScreen(this.quizScreen);
        this.renderQuestion(0);
    }
}

// ============================================================================
// 5. APPLICATION INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    window.birthdayApp = new BirthdayQuizApp();
});
