(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const loadingScreen = $("#loadingScreen");
  const toast = $("#toast");
  const heroInput = $("#heroSearchInput");
  const heroSearchBtn = $("#heroSearchBtn");
  const searchInput = $("#searchInput");
  const searchBtn = $("#searchBtn");
  const answerArea = $("#answerArea");
  const answerTitle = $("#answerTitle");
  const answerBody = $("#answerBody");
  const sourceLink = $("#sourceLink");
  const sourceBadge = $("#sourceBadge");
  const searchStatus = $("#searchStatus");
  const authModal = $("#authModal");
  const savedModal = $("#savedModal");
  const authForm = $("#authForm");
  const nameInput = $("#nameInput");
  const emailInput = $("#emailInput");
  const passwordInput = $("#passwordInput");
  const authTitle = $("#authTitle");
  const authSub = $("#authSub");
  const authSubmit = $("#authSubmit");
  const nameLabel = $("#nameLabel");
  const switchAuth = $("#switchAuth");
  let authMode = "register";
  let currentAnswerText = "";

  // Always release the splash screen. This is deliberately independent
  // of API calls so a network error can never trap the user on the loader.
  function hideLoader() {
    if (!loadingScreen) return;
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 650);
  }
  window.addEventListener("load", () => setTimeout(hideLoader, 450));
  setTimeout(hideLoader, 2500);

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[ch]));
  }

  function saveTopic(query) {
    const old = JSON.parse(localStorage.getItem("alvin_saved_topics") || "[]");
    const next = [query, ...old.filter(x => x.toLowerCase() !== query.toLowerCase())].slice(0, 20);
    localStorage.setItem("alvin_saved_topics", JSON.stringify(next));
  }

  function getSavedTopics() {
    return JSON.parse(localStorage.getItem("alvin_saved_topics") || "[]");
  }

  function openSaved() {
    const list = $("#savedList");
    const topics = getSavedTopics();
    list.innerHTML = "";
    if (!topics.length) {
      list.innerHTML = '<p class="search-status">No saved topics yet. Search something first.</p>';
    } else {
      topics.forEach(topic => {
        const row = document.createElement("div");
        row.className = "saved-item";
        row.innerHTML = `<span>${escapeHTML(topic)}</span>
          <button type="button" data-topic="${escapeHTML(topic)}">Open</button>`;
        row.querySelector("button").addEventListener("click", () => {
          savedModal.classList.add("hidden");
          runSearch(topic);
        });
        list.appendChild(row);
      });
    }
    savedModal.classList.remove("hidden");
  }

  function setAuthMode(mode) {
    authMode = mode;
    const register = mode === "register";
    authTitle.textContent = register ? "Create your account" : "Welcome back";
    authSub.textContent = register
      ? "Register locally on this browser for Stage 1."
      : "Login to the local Stage 1 demo account.";
    nameLabel.style.display = register ? "block" : "none";
    nameInput.required = register;
    passwordInput.autocomplete = register ? "new-password" : "current-password";
    authSubmit.textContent = register ? "Create account" : "Login";
    switchAuth.textContent = register ? "Already registered? Login" : "Need an account? Register";
  }

  function openAuth(mode) {
    setAuthMode(mode);
    authModal.classList.remove("hidden");
    setTimeout(() => (registerMode(mode) ? nameInput : emailInput).focus(), 50);
  }

  function registerMode(mode) {
    return mode === "register";
  }

  function closeModals() {
    authModal.classList.add("hidden");
    savedModal.classList.add("hidden");
  }

  // Theme
  const storedTheme = localStorage.getItem("alvin_theme");
  if (storedTheme === "light") document.body.classList.add("light");
  function updateThemeIcon() {
    $("#themeBtn").textContent = document.body.classList.contains("light") ? "☀" : "☾";
  }
  updateThemeIcon();
  $("#themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("alvin_theme", document.body.classList.contains("light") ? "light" : "dark");
    updateThemeIcon();
  });

  // Mobile menu
  $("#menuBtn").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
  $$(".main-nav a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));

  // Auth demo
  $("#registerBtn").addEventListener("click", () => openAuth("register"));
  $("#loginBtn").addEventListener("click", () => openAuth("login"));
  switchAuth.addEventListener("click", () => setAuthMode(authMode === "register" ? "login" : "register"));

  $$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModals));
  $$("[data-close-saved]").forEach(el => el.addEventListener("click", () => savedModal.classList.add("hidden")));

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || password.length < 6) {
      showToast("Please enter a valid email and a 6+ character password.");
      return;
    }

    const key = "alvin_account";
    if (authMode === "register") {
      const name = nameInput.value.trim();
      if (!name) {
        showToast("Please enter your name.");
        return;
      }
      localStorage.setItem(key, JSON.stringify({ name, email, password }));
      authModal.classList.add("hidden");
      showToast(`Welcome to ALVIN AI, ${name}!`);
      authForm.reset();
    } else {
      const account = JSON.parse(localStorage.getItem(key) || "null");
      if (!account || account.email !== email || account.password !== password) {
        showToast("No matching local account. Register first.");
        return;
      }
      authModal.classList.add("hidden");
      showToast(`Welcome back, ${account.name}!`);
      authForm.reset();
    }
  });

  // Search engine
  async function runSearch(rawQuery) {
    const query = rawQuery.trim();
    if (!query) {
      showToast("Type a question or topic first.");
      return;
    }

    searchInput.value = query;
    heroInput.value = query;
    answerArea.classList.add("hidden");
    searchStatus.textContent = `Searching for “${query}”...`;
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
      // Wikipedia REST API is used for Stage 1 public knowledge search.
      const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, "_"))}`;
      const response = await fetch(endpoint, {
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) throw new Error("Exact page not found");
      const data = await response.json();

      if (data.type === "disambiguation") {
        throw new Error("This topic has multiple meanings.");
      }

      const title = data.title || query;
      const extract = data.extract || "No summary was returned for this topic.";
      currentAnswerText = `${title}\n\n${extract}`;

      answerTitle.textContent = title;
      answerBody.innerHTML = `<p>${escapeHTML(extract)}</p>
        <p><strong>Simple way to understand it:</strong> Start with the main idea above, then use the source link to explore examples, history, related concepts and references.</p>`;
      sourceBadge.textContent = "Wikipedia";
      sourceLink.href = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
      answerArea.classList.remove("hidden");
      saveTopic(query);
      searchStatus.textContent = "Answer found. You can save, copy, or read it aloud.";
      answerArea.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      // Fallback: send user to Wikipedia search instead of leaving a broken screen.
      const url = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
      currentAnswerText = `${query}\n\nALVIN could not retrieve the article automatically. Use the source search to continue.`;
      answerTitle.textContent = query;
      answerBody.innerHTML = `<p>ALVIN couldn't retrieve a matching article automatically.</p>
        <p>You can continue searching the public knowledge base using the source button below.</p>`;
      sourceBadge.textContent = "Search";
      sourceLink.href = url;
      answerArea.classList.remove("hidden");
      saveTopic(query);
      searchStatus.textContent = "No direct result. A source search is ready.";
      answerArea.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    }
  }

  heroSearchBtn.addEventListener("click", () => runSearch(heroInput.value));
  searchBtn.addEventListener("click", () => runSearch(searchInput.value));

  [heroInput, searchInput].forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") runSearch(input.value);
    });
  });

  $$(".chip, .learning-card").forEach(el => {
    el.addEventListener("click", () => runSearch(el.dataset.query));
  });

  // Read aloud
  $("#speakBtn").addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      showToast("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentAnswerText);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  });

  // Copy
  $("#copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentAnswerText);
      showToast("Explanation copied.");
    } catch {
      showToast("Copy is not available in this browser.");
    }
  });

  // Practice question
  $("#practiceBtn").addEventListener("click", () => {
    if (!answerTitle.textContent || answerArea.classList.contains("hidden")) {
      showToast("Search a topic first.");
      return;
    }
    const topic = answerTitle.textContent;
    answerBody.insertAdjacentHTML("beforeend",
      `<div style="margin-top:20px;padding:15px;border:1px solid var(--line);border-radius:14px;">
        <strong>Practice question</strong>
        <p style="margin-bottom:0;">In your own words, explain the main idea of <b>${escapeHTML(topic)}</b> and give one real-world example.</p>
      </div>`
    );
    showToast("Practice question created.");
  });

  // Voice search
  $("#voiceBtn").addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice search is not supported by this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    showToast("Listening...");
    recognition.start();
    recognition.onresult = e => {
      const text = e.results[0][0].transcript;
      heroInput.value = text;
      runSearch(text);
    };
    recognition.onerror = () => showToast("Voice search could not start. Check microphone permission.");
  });

  $("#savedBtn").addEventListener("click", openSaved);

  // Close modal with Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModals();
  });
})();
