// Smooth scroll
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

let streak = localStorage.getItem("streak") || 0;

function updateStreak() {
    streak_++;
    localStorage.setItem("streak", streak);
    console.log("Streak", streak);
}

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        
        const updateCounter = () => {
            const current = +counter.innerText;
            
            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.getElementById('about'));

let time = 1500;
let timerInterval = null;
let isRunning = false;
let distractions = 0;

function updateDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById("timerDisplay").innerText = 
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timerInterval = setInterval(() => {
        time--;

        if (time <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            completeSession();
        }

        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    time = 1500;
    distractions = 0;
    updateDisplay();
    updateDistractions();
}

let sessionScore = calculateSessionScore();
saveScore(sessionScore);

function completeSession() {
    alert("Session complete. Take a Break.");

    let sessions = localStorage.getItem("sessions") || 0;
    sessions++;
    localStorage.setItem("sessions", sessions);

    updateStreak();
    updateProgress();
}

function logDistraction() {
    distractions++;
    updateDistractions();
}

function updateDistractions() {
    document.getElementById("distractionCount").innerText = 
        `Distractions: ${distractions}`;
}

const tips = [
    "Put your phone in another room.",
    "Work in 45-60 minute blocks.",
    "Start with an easy task to build momentum.",
    "Use a timer to stay accountable.",
    "Avoid multitasking, it kills focus.",
    "Take intentional breaks.",
    "Study in the same spot every day.",
    "Track your distractions to improve awareness."
];

function generateTip() {
    const random = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById("tipOutput").innerText = random;
}

function calculateSessionScore() {
    let score = 100 - (distractions * 10);
    score = Math.max(0, score);
    return score;
}

function saveScore(score) {
    let best = localStorage.getItem("bestScore") || 0;
    if (score > best) {
        localStorage.setItem("bestScore", score);
    }
    updateProgress();
}

function updateProgress() {
    const sessions = localStorage.getItem("sessions") || 0;
    const best = localStorage.getItem("bestScore") || 0;

    document.getElementById("sessionCount").innerText = 
            `Sessions Completed: ${sessions}`;

    document.getElementById("bestScore").innerText = 
            `Best Focus Score: ${best}`;
}

updateDisplay();
updateProgress();

// 🔥 Focus Analyzer (UPGRADED)
function analyzeFocus() {
    const input = document.getElementById('userInput').value.toLowerCase();
    const output = document.getElementById('output');

    if (!input.trim()) {
        output.innerHTML = '<p>Write something first.</p>';
        return;
    }

    let feedback = "";
    let score = 50;

    if (input.includes("phone") || input.includes("tiktok") || input.includes("instagram")) {
        feedback += "📱 You're getting distracted by your phone.<br>";
        score -= 20;
    }

    if (input.includes("music")) {
        feedback += "🎧 Music can help, but only if it's non-distracting.<br>";
    }

    if (input.includes("break")) {
        feedback += "⏱️ Good — breaks improve long-term focus.<br>";
        score += 10;
    }

    if (input.includes("multitask")) {
        feedback += "⚠️ Multitasking is hurting your efficiency.<br>";
        score -= 15;
    }

    if (input.includes("plan") || input.includes("schedule")) {
        feedback += "📋 Planning boosts focus significantly.<br>";
        score += 15;
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    let rating = "";
    if (score >= 80) rating = "Elite Focus";
    else if (score >= 60) rating = "Good";
    else if (score >= 40) rating = "Average";
    else rating = "Needs Improvement";

    output.innerHTML = `
        <p><strong>Focus Score:</strong> ${score}/100</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p>${feedback}</p>
    `;
    saveScore(score);
}

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Enter key support
document.getElementById('userInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        analyzeFocus();
    }
});