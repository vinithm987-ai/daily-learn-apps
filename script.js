/* ==========================================================================
   NexusAI - Application Logic & State Engine
   ========================================================================== */

// 1. App State
const state = {
  theme: localStorage.getItem('nexus_theme') || 'dark',
  currentView: 'home',
  user: {
    name: 'Alex M.',
    xp: 3450,
    streak: 14,
    quizzesCleared: 28,
    isLoggedIn: false
  },
  // Place your API Key here or load from an environment/proxy in production
  geminiApiKey: 'YOUR_GEMINI_API_KEY'
};

// 2. DOM Selectors
const themeToggleBtn = document.getElementById('theme-toggle');
const navItems = document.querySelectorAll('.nav-item');
const authModal = document.getElementById('auth-modal');
const openAuthBtn = document.getElementById('open-auth-btn');
const closeAuthBtn = document.getElementById('close-auth-btn');
const authForm = document.getElementById('auth-form');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const generateQuizBtn = document.getElementById('generate-quiz-btn');
const generateVocabBtn = document.getElementById('generate-vocab-btn');

// 3. Navigation View Switcher
function switchView(viewName) {
  state.currentView = viewName;
  
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
  item.addEventListener('click', () => switchView(item.dataset.view));
});

// 4. Dark / Light Mode Toggle
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  localStorage.setItem('nexus_theme', theme);
}

themeToggleBtn.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(state.theme);
});
applyTheme(state.theme);

// 5. Auth Modal Controls
openAuthBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
closeAuthBtn.addEventListener('click', () => authModal.classList.add('hidden'));

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.user.isLoggedIn = true;
  document.getElementById('open-auth-btn').classList.add('hidden');
  document.getElementById('user-profile').classList.remove('hidden');
  authModal.classList.add('hidden');
});

// 6. Gemini AI Assistant Engine (Direct REST API Call)
async function sendGeminiPrompt(promptText) {
  if (!state.geminiApiKey || state.geminiApiKey === 'YOUR_GEMINI_API_KEY') {
    return `[Mock Response] To get real-time responses from Gemini, replace YOUR_GEMINI_API_KEY in script.js. Here is a simulated breakdown of: "${promptText}".`;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${state.geminiApiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// Chat UI Handler
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  // Add User Message
  appendMessage(text, 'user');
  chatInput.value = '';

  // Add Typing Placeholder
  const typingIndicator = appendMessage('Gemini is thinking...', 'assistant');

  try {
    const aiResponse = await sendGeminiPrompt(text);
    typingIndicator.querySelector('.bubble').textContent = aiResponse;
    
    // Reward XP for active learning
    addXP(25);
  } catch (error) {
    typingIndicator.querySelector('.bubble').textContent = 'Unable to reach Gemini. Please check your API key or connection.';
  }
});

function appendMessage(text, role) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  msgDiv.innerHTML = `<div class="bubble">${text}</div>`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgDiv;
}

// 7. Gamification: XP & Progress Engine
function addXP(amount) {
  state.user.xp += amount;
  const xpEl = document.getElementById('stat-xp');
  if (xpEl) xpEl.textContent = `${state.user.xp.toLocaleString()} XP`;
}

// 8. Dynamic Quiz Generator Handler
if (generateQuizBtn) {
  generateQuizBtn.addEventListener('click', async () => {
    const topic = document.getElementById('quiz-topic').value.trim() || 'General Knowledge';
    const container = document.getElementById('quiz-container');
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');

    container.classList.remove('hidden');
    questionEl.textContent = `Generating adaptive question on: ${topic}...`;
    optionsEl.innerHTML = '';

    // Sample question format (can be replaced with live Gemini JSON response)
    setTimeout(() => {
      questionEl.textContent = `Which fundamental metric measures how effectively a firm utilizes its assets to generate earnings?`;
      const options = ['Return on Assets (ROA)', 'Current Ratio', 'Quick Ratio', 'Debt-to-Equity'];
      
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.style.width = '100%';
        btn.style.marginBottom = '0.5rem';
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt.includes('ROA')) {
            btn.style.borderColor = 'var(--success)';
            btn.style.color = 'var(--success)';
            addXP(50);
          } else {
            btn.style.borderColor = '#ef4444';
          }
        };
        optionsEl.appendChild(btn);
      });
    }, 600);
  });
}
