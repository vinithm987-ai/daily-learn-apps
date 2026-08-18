/* =====================================================
   ALVIN AI
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   DOM ELEMENTS
===================================================== */

const loader = document.getElementById("loader");

const authOverlay = document.getElementById("authOverlay");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authButtonText = document.getElementById("authButtonText");

const nameGroup = document.getElementById("nameGroup");
const registerName = document.getElementById("registerName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const switchAuth = document.getElementById("switchAuth");
const switchText = document.getElementById("switchText");

const openProfile = document.getElementById("openProfile");
const closeAuth = document.getElementById("closeAuth");

const togglePassword =
  document.getElementById("togglePassword");

const themeBtn =
  document.getElementById("themeBtn");

const searchInput =
  document.getElementById("searchInput");

const searchBtn =
  document.getElementById("searchBtn");

const voiceBtn =
  document.getElementById("voiceBtn");

const answerSection =
  document.getElementById("answerSection");

const answerQuestion =
  document.getElementById("answerQuestion");

const answerText =
  document.getElementById("answerText");

const clearAnswer =
  document.getElementById("clearAnswer");

const speakBtn =
  document.getElementById("speakBtn");

const copyBtn =
  document.getElementById("copyBtn");

const historyList =
  document.getElementById("historyList");

const clearHistory =
  document.getElementById("clearHistory");

const toast =
  document.getElementById("toast");

const toastMessage =
  document.getElementById("toastMessage");


/* =====================================================
   LOADING
===================================================== */

window.addEventListener("load", function () {

  setTimeout(function () {

    loader.classList.add("hide");

  }, 700);

});


/* =====================================================
   AUTH SYSTEM
===================================================== */

let loginMode = false;


/* Open registration */

openProfile.addEventListener("click", function () {

  const currentUser =
    localStorage.getItem("alvinUser");

  if (currentUser) {

    const user =
      JSON.parse(currentUser);

    showToast(
      "Logged in as " + user.name
    );

    return;
  }

  loginMode = false;

  updateAuthUI();

  authOverlay.classList.remove("hidden");

});


/* Close */

closeAuth.addEventListener("click", function () {

  authOverlay.classList.add("hidden");

});


/* Switch login/register */

switchAuth.addEventListener("click", function () {

  loginMode = !loginMode;

  updateAuthUI();

});


function updateAuthUI() {

  if (loginMode) {

    authTitle.textContent =
      "Welcome back";

    authSubtitle.textContent =
      "Login to continue learning.";

    authButtonText.textContent =
      "Login";

    switchText.textContent =
      "Don't have an account?";

    switchAuth.textContent =
      "Register";

    nameGroup.style.display =
      "none";

  } else {

    authTitle.textContent =
      "Welcome to ALVIN";

    authSubtitle.textContent =
      "Create your account and start learning.";

    authButtonText.textContent =
      "Create Account";

    switchText.textContent =
      "Already have an account?";

    switchAuth.textContent =
      "Login";

    nameGroup.style.display =
      "block";
  }

}


/* Register / login */

authForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value.trim();

  const name =
    registerName.value.trim();


  if (!email || !password) {

    showToast("Please enter email and password.");

    return;
  }


  if (loginMode) {

    const saved =
      localStorage.getItem("alvinAccount");

    if (!saved) {

      showToast(
        "No account found. Please register first."
      );

      return;
    }

    const account =
      JSON.parse(saved);

    if (
      account.email !== email ||
      account.password !== password
    ) {

      showToast(
        "Incorrect email or password."
      );

      return;
    }


    localStorage.setItem(
      "alvinUser",
      JSON.stringify(account)
    );

    showToast("Login successful!");

  } else {

    if (!name) {

      showToast("Please enter your name.");

      return;
    }


    const account = {

      name: name,

      email: email,

      password: password

    };


    localStorage.setItem(
      "alvinAccount",
      JSON.stringify(account)
    );


    localStorage.setItem(
      "alvinUser",
      JSON.stringify(account)
    );


    showToast(
      "Account created successfully!"
    );

  }


  authOverlay.classList.add("hidden");

  authForm.reset();

});


/* Password visibility */

togglePassword.addEventListener("click", function () {

  if (passwordInput.type === "password") {

    passwordInput.type = "text";

    togglePassword.textContent = "🙈";

  } else {

    passwordInput.type = "password";

    togglePassword.textContent = "👁";

  }

});


/* =====================================================
   THEME
===================================================== */

const savedTheme =
  localStorage.getItem("alvinTheme");

if (savedTheme === "light") {

  document.body.classList.add("light");

  themeBtn.textContent = "☀️";

}


themeBtn.addEventListener("click", function () {

  document.body.classList.toggle("light");

  const isLight =
    document.body.classList.contains("light");

  localStorage.setItem(
    "alvinTheme",
    isLight ? "light" : "dark"
  );

  themeBtn.textContent =
    isLight ? "☀️" : "🌙";

});


/* =====================================================
   PAGE NAVIGATION
===================================================== */

const navLinks =
  document.querySelectorAll(".nav-link");

const pages =
  document.querySelectorAll(".page");


function openPage(pageName) {

  pages.forEach(function (page) {

    page.classList.remove("active-page");

  });


  navLinks.forEach(function (link) {

    link.classList.remove("active");

  });


  const target =
    document.getElementById(pageName);

  if (target) {

    target.classList.add("active-page");

  }


  navLinks.forEach(function (link) {

    if (link.dataset.page === pageName) {

      link.classList.add("active");

    }

  });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


navLinks.forEach(function (link) {

  link.addEventListener("click", function () {

    openPage(link.dataset.page);

  });

});


/* Feature cards */

document
  .querySelectorAll("[data-page-link]")
  .forEach(function (card) {

    card.addEventListener("click", function () {

      openPage(card.dataset.pageLink);

    });

  });


/* =====================================================
   AI ANSWER ENGINE
===================================================== */

function generateAnswer(question) {

  const q =
    question.toLowerCase().trim();


  /* Artificial Intelligence */

  if (
    q.includes("artificial intelligence") ||
    q === "ai" ||
    q.includes("what is ai")
  ) {

    return `
      <h3 class="answer-title">
        🤖 Artificial Intelligence
      </h3>

      <p>
        Artificial Intelligence (AI) is a field of
        computer science that enables machines to
        perform tasks that normally require human
        intelligence.
      </p>

      <p>
        AI systems can learn from data, recognize
        patterns, understand language, make
        predictions and support decision-making.
      </p>

      <p>
        <strong>Example:</strong>
        A recommendation system on YouTube or Netflix
        studies your previous activity and suggests
        content you may like.
      </p>

      <p>
        <strong>Simple definition:</strong>
        AI means making computers capable of performing
        intelligent tasks.
      </p>
    `;

  }


  /* Finance */

  if (
    q.includes("financial management") ||
    q.includes("finance")
  ) {

    return `
      <h3 class="answer-title">
        💰 Financial Management
      </h3>

      <p>
        Financial management is the planning,
        organizing and controlling of financial
        resources in an organization.
      </p>

      <p>
        Its main objective is to use money efficiently
        and increase the value of the business.
      </p>

      <p>
        <strong>Major decisions include:</strong>
      </p>

      <ul>
        <li>Investment decisions</li>
        <li>Financing decisions</li>
        <li>Dividend decisions</li>
        <li>Working capital management</li>
      </ul>

      <p>
        <strong>Example:</strong>
        A company deciding whether to invest ₹10 lakh
        in a new project is making an investment
        decision.
      </p>
    `;

  }


  /* English */

  if (
    q.includes("english") ||
    q.includes("speaking")
  ) {

    return `
      <h3 class="answer-title">
        🗣️ Improve Your English Speaking
      </h3>

      <p>
        The best way to improve English speaking is
        to practice a little every day.
      </p>

      <p>
        <strong>Daily 20-minute routine:</strong>
      </p>

      <ul>
        <li>5 minutes — learn new words</li>
        <li>5 minutes — read aloud</li>
        <li>5 minutes — speak about your day</li>
        <li>5 minutes — listen and repeat</li>
      </ul>

      <p>
        Don't worry about making mistakes.
        Focus first on speaking clearly and
        confidently.
      </p>
    `;

  }


  /* Marketing */

  if (q.includes("marketing")) {

    return `
      <h3 class="answer-title">
        📢 Marketing
      </h3>

      <p>
        Marketing is the process of identifying
        customer needs and creating, communicating
        and delivering products or services that
        satisfy those needs.
      </p>

      <p>
        The traditional marketing mix is known as
        the <strong>4Ps</strong>:
      </p>

      <ul>
        <li>Product</li>
        <li>Price</li>
        <li>Place</li>
        <li>Promotion</li>
      </ul>

      <p>
        <strong>Example:</strong>
        A company launching a new smartphone must
        decide its features, price, distribution and
        advertising strategy.
      </p>
    `;

  }


  /* Economics */

  if (q.includes("economics")) {

    return `
      <h3 class="answer-title">
        📈 Economics
      </h3>

      <p>
        Economics is the study of how individuals,
        businesses and governments use limited
        resources to satisfy unlimited wants.
      </p>

      <p>
        The two major branches are:
      </p>

      <ul>
        <li><strong>Microeconomics</strong> — individuals,
        firms and markets.</li>

        <li><strong>Macroeconomics</strong> — inflation,
        unemployment, GDP and economic growth.</li>
      </ul>
    `;

  }


  /* HR */

  if (
    q.includes("human resource") ||
    q.includes("hr management")
  ) {

    return `
      <h3 class="answer-title">
        👥 Human Resource Management
      </h3>

      <p>
        Human Resource Management (HRM) is the process
        of managing people in an organization.
      </p>

      <p>
        HR activities include recruitment, selection,
        training, performance management, compensation
        and employee development.
      </p>

      <p>
        <strong>Example:</strong>
        When a company recruits a new employee and
        provides training, HRM is involved.
      </p>
    `;

  }


  /* Default answer */

  return `
    <h3 class="answer-title">
      🔎 ALVIN understands your question
    </h3>

    <p>
      You asked:
      <strong>${escapeHTML(question)}</strong>
    </p>

    <p>
      This is the built-in ALVIN learning engine.
      It can provide structured explanations for
      common learning topics.
    </p>

    <p>
      Try asking about topics such as:
    </p>

    <ul>
      <li>Artificial Intelligence</li>
      <li>Financial Management</li>
      <li>Marketing</li>
      <li>Economics</li>
      <li>Human Resource Management</li>
      <li>English Speaking</li>
    </ul>

    <p>
      <strong>Important:</strong>
      For truly live answers to any question on the
      internet, ALVIN needs to be connected to a real
      AI/search API.
    </p>
  `;

}


/* =====================================================
   SEARCH
===================================================== */

function performSearch(question) {

  question =
    question.trim();


  if (!question) {

    showToast(
      "Please enter something to search."
    );

    return;
  }


  answerQuestion.textContent =
    question;

  answerText.innerHTML =
    generateAnswer(question);

  answerSection.classList.remove("hidden");


  saveHistory(question);


  setTimeout(function () {

    answerSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 100);

}


searchBtn.addEventListener("click", function () {

  performSearch(
    searchInput.value
  );

});


searchInput.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {

    performSearch(
      searchInput.value
    );

  }

});


/* Quick search buttons */

document
  .querySelectorAll("[data-search]")
  .forEach(function (button) {

    button.addEventListener("click", function () {

      const query =
        button.dataset.search;

      searchInput.value =
        query;

      openPage("home");

      performSearch(query);

    });

  });


/* Clear answer */

clearAnswer.addEventListener("click", function () {

  answerSection.classList.add("hidden");

  answerText.innerHTML = "";

});


/* =====================================================
   HISTORY
===================================================== */

function getHistory() {

  return JSON.parse(
    localStorage.getItem("alvinHistory") || "[]"
  );

}


function saveHistory(question) {

  let history =
    getHistory();


  history =
    history.filter(function (item) {

      return item.question !== question;

    });


  history.unshift({

    question: question,

    time: new Date().toLocaleString()

  });


  history =
    history.slice(0, 10);


  localStorage.setItem(
    "alvinHistory",
    JSON.stringify(history)
  );


  renderHistory();

}


function renderHistory() {

  const history =
    getHistory();


  if (!history.length) {

    historyList.innerHTML = `
      <div class="empty-state">
        Your recent searches will appear here.
      </div>
    `;

    return;

  }


  historyList.innerHTML =
    history.map(function (item) {

      return `
        <div
          class="history-item"
          data-history="${escapeHTML(item.question)}"
        >

          <span class="history-question">
            🔎 ${escapeHTML(item.question)}
          </span>

          <span class="history-time">
            ${escapeHTML(item.time)}
          </span>

        </div>
      `;

    }).join("");


  document
    .querySelectorAll(".history-item")
    .forEach(function (item) {

      item.addEventListener("click", function () {

        const question =
          item.dataset.history;

        searchInput.value =
          question;

        openPage("home");

        performSearch(question);

      });

    });

}


clearHistory.addEventListener("click", function () {

  localStorage.removeItem(
    "alvinHistory"
  );

  renderHistory();

  showToast("Search history cleared.");

});


renderHistory();


/* =====================================================
   COPY ANSWER
===================================================== */

copyBtn.addEventListener("click", async function () {

  const text =
    answerText.innerText;


  try {

    await navigator.clipboard.writeText(text);

    showToast(
      "Answer copied!"
    );

  } catch (error) {

    showToast(
      "Copy failed. Please select the text."
    );

  }

});


/* =====================================================
   TEXT TO SPEECH
===================================================== */

speakBtn.addEventListener("click", function () {

  if (!("speechSynthesis" in window)) {

    showToast(
      "Text-to-speech is not supported."
    );

    return;
  }


  speechSynthesis.cancel();


  const text =
    answerText.innerText;


  const speech =
    new SpeechSynthesisUtterance(text);


  speech.rate = 0.95;

  speech.pitch = 1;


  speechSynthesis.speak(
    speech
  );

});


/* =====================================================
   VOICE SEARCH
===================================================== */

voiceBtn.addEventListener("click", function () {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if (!SpeechRecognition) {

    showToast(
      "Voice search is not supported in this browser."
    );

    return;
  }


  const recognition =
    new SpeechRecognition();


  recognition.lang =
    "en-IN";

  recognition.interimResults =
    false;

  recognition.continuous =
    false;


  voiceBtn.textContent =
    "🔴";


  recognition.start();


  recognition.onresult =
    function (event) {

      const transcript =
        event.results[0][0].transcript;

      searchInput.value =
        transcript;

      performSearch(
        transcript
      );

    };


  recognition.onerror =
    function () {

      showToast(
        "Voice search failed."
      );

    };


  recognition.onend =
    function () {

      voiceBtn.textContent =
        "🎙";

    };

});


/* =====================================================
   QUIZ
===================================================== */

const questions = [

  {
    question:
      "What does AI stand for?",

    options: [
      "Artificial Intelligence",
      "Automated Internet",
      "Advanced Information",
      "Artificial Internet"
    ],

    answer: 0
  },


  {
    question:
      "Which is a major financial management decision?",

    options: [
      "Investment decision",
      "Weather decision",
      "Food decision",
      "Travel decision"
    ],

    answer: 0
  },


  {
    question:
      "What are the 4Ps of marketing?",

    options: [
      "Product, Price, Place, Promotion",
      "People, Profit, Plan, Product",
      "Price, People, Power, Plan",
      "Product, People, Profit, Place"
    ],

    answer: 0
  },


  {
    question:
      "Which branch of economics studies individual firms and consumers?",

    options: [
      "Macroeconomics",
      "Microeconomics",
      "International economics",
      "Public economics"
    ],

    answer: 1
  },


  {
    question:
      "What does HRM mainly focus on?",

    options: [
      "Machines",
      "Buildings",
      "People",
      "Products"
    ],

    answer: 2
  }

];


let currentQuestion = 0;

let quizScore = 0;

let selectedAnswer = null;


const questionNumber =
  document.getElementById("questionNumber");

const scoreElement =
  document.getElementById("score");

const questionText =
  document.getElementById("questionText");

const quizOptions =
  document.getElementById("quizOptions");

const nextQuestion =
  document.getElementById("nextQuestion");

const quizProgress =
  document.getElementById("quizProgress");


function loadQuestion() {

  const question =
    questions[currentQuestion];


  selectedAnswer =
    null;


  questionNumber.textContent =
    `Question ${currentQuestion + 1} / ${questions.length}`;


  scoreElement.textContent =
    `Score: ${quizScore}`;


  questionText.textContent =
    question.
