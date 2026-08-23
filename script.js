const lessons=[
 {title:"Smart Study Habits",level:"Beginner",time:"5 min",text:"Good learning is not about studying for many hours. Study one small topic, remove distractions, practise it, and review it later. Short daily practice is easier to continue than irregular long study sessions.",tip:"Choose one small learning target every day."},
 {title:"How to Speak English Clearly",level:"Beginner",time:"5 min",text:"Speak slowly and use short sentences. Do not worry about making every sentence perfect. Listen, repeat, record your voice, and try again. Confidence grows through regular practice.",tip:"Speak for two minutes every day without stopping."},
 {title:"Understanding Financial Management",level:"MBA",time:"7 min",text:"Financial management is the process of planning, obtaining, using, and controlling money in a business. Its major decisions include investment decisions, financing decisions, and dividend decisions.",tip:"Remember: investment, financing, and dividend decisions."}
];

const words=[
 ["Abundant","ə-BUN-dənt","adjective","More than enough","The company has abundant resources.","B2"],
 ["Accurate","AK-yuh-rət","adjective","Correct and free from mistakes","Please provide accurate information.","B1"],
 ["Adapt","uh-DAPT","verb","To change to suit a new situation","Students must adapt to new learning methods.","B1"],
 ["Benefit","BEN-uh-fit","noun/verb","An advantage; to gain an advantage","Reading daily has many benefits.","B1"],
 ["Confident","KON-fi-dənt","adjective","Sure about your ability","She feels confident before the interview.","B1"],
 ["Efficient","ih-FISH-ənt","adjective","Working well without wasting time","This method is efficient.","B2"],
 ["Evaluate","ih-VAL-yoo-ayt","verb","To judge or assess something","We evaluate the investment before deciding.","B2"],
 ["Improve","im-PROOV","verb","To make something better","I want to improve my communication skills.","A2"],
 ["Relevant","REL-uh-vənt","adjective","Connected with the topic","Give only relevant information.","B2"],
 ["Sustainable","suh-STAY-nə-bəl","adjective","Able to continue for a long time","The company needs a sustainable strategy.","B2"]
];

const quizzes=[
 {q:"What is financial management?",o:["Planning and controlling business money","Only selling products","Only hiring employees","Only advertising"],a:0,e:"Financial management focuses on planning, obtaining, using and controlling money."},
 {q:"Which habit helps English speaking?",o:["Never speaking","Speaking and practising regularly","Only memorising grammar","Avoiding mistakes completely"],a:1,e:"Regular speaking practice builds fluency and confidence."},
 {q:"What does 'accurate' mean?",o:["Very expensive","Correct and without mistakes","Very fast","Difficult"],a:1,e:"Accurate means correct and free from mistakes."},
 {q:"Which is a good study method?",o:["One small target every day","No revision","Studying only once a month","Avoiding practice"],a:0,e:"Small daily targets make learning consistent."},
 {q:"What does sustainable mean?",o:["Temporary","Able to continue for a long time","Incorrect","Unrelated"],a:1,e:"Sustainable means able to continue over a long period."}
];

const state={
 page:"home",
 lesson:0,
 word:0,
 quiz:0,
 score:0,
 quizAnswered:false,
 completedLessons:Number(localStorage.getItem("dl_lessons")||0),
 wordsSeen:Number(localStorage.getItem("dl_words")||0),
 streak:Number(localStorage.getItem("dl_streak")||1),
 theme:localStorage.getItem("dl_theme")||"light"
};

const app=document.getElementById("app");
document.getElementById("year").textContent=new Date().getFullYear();
if(state.theme==="dark") document.body.classList.add("dark");

function save(){
 localStorage.setItem("dl_lessons",state.completedLessons);
 localStorage.setItem("dl_words",state.wordsSeen);
 localStorage.setItem("dl_streak",state.streak);
 localStorage.setItem("dl_theme",state.theme);
}

function pageTitle(title,sub){return `<div class="page-head"><h2>${title}</h2><p>${sub}</p></div>`}

function render(){
 document.querySelectorAll("[data-page]").forEach(a=>{
   a.classList.toggle("active",a.dataset.page===state.page);
 });
 const pages={home:homePage,lessons:lessonsPage,vocabulary:vocabularyPage,speaking:speakingPage,grammar:grammarPage,quiz:quizPage,ai:aiPage,progress:progressPage};
 app.innerHTML=(pages[state.page]||homePage)();
 window.scrollTo({top:0,behavior:"smooth"});
 bindPageEvents();
}

function homePage(){
 const done=Math.min(100,Math.round((state.completedLessons/lessons.length)*100));
 return `<section class="hero">
   <div>
    <span class="badge">YOUR DAILY STUDY SPACE</span>
    <h1>Learn something useful every day.</h1>
    <p>Build English, academic knowledge and confidence through short lessons, vocabulary, speaking practice and quizzes.</p>
    <div class="hero-actions">
      <button class="btn primary" data-action="start">Start today's learning →</button>
      <button class="btn secondary" data-page="vocabulary">Learn 5 words</button>
    </div>
   </div>
   <div class="hero-card">
    <p class="muted">Today's progress</p>
    <div class="today-number">${done}%</div>
    <div class="progress"><span style="width:${done}%"></span></div>
    <p style="margin-top:12px">${state.completedLessons} of ${lessons.length} lessons completed</p>
   </div>
 </section>
 <section class="stat-grid">
  <div class="stat-card"><span class="muted">🔥 Streak</span><div class="num">${state.streak} days</div><p>Keep learning daily.</p></div>
  <div class="stat-card"><span class="muted">🧠 Words learned</span><div class="num">${state.wordsSeen}</div><p>Vocabulary progress.</p></div>
  <div class="stat-card"><span class="muted">🏆 Quiz score</span><div class="num">${state.score}/${quizzes.length}</div><p>Best score this session.</p></div>
 </section>
 <div class="section-head"><div><h2>What do you want to learn?</h2><p class="muted">Choose a section and start immediately.</p></div></div>
 <section class="card-grid">
  ${feature("📚","Daily Lessons","Short lessons for English and academic topics.","lessons")}
  ${feature("🧠","Vocabulary","Learn useful words with meaning, examples and pronunciation.","vocabulary")}
  ${feature("🗣️","Speaking Practice","Read sentences aloud and practise your confidence.","speaking")}
  ${feature("✍️","Grammar","Practise common grammar mistakes and corrections.","grammar")}
  ${feature("❓","Daily Quiz","Test yourself and get instant explanations.","quiz")}
  ${feature("🔎","Learning Search","Ask a question and get a useful study answer.","ai")}
 </section>`;
}
function feature(icon,title,desc,page){return `<button class="card" style="text-align:left" data-page="${page}"><div class="feature-icon">${icon}</div><h3>${title}</h3><p>${desc}</p></button>`}

function lessonsPage(){
 const l=lessons[state.lesson];
 return `${pageTitle("Daily Lessons","Short lessons designed for consistent daily learning.")}
 <div class="lesson-layout">
  <article class="card lesson-main">
   <span class="badge">${l.level} • ${l.time}</span>
   <h2>${l.title}</h2>
   <p>${l.text}</p>
   <div class="tip">💡 <strong>Remember:</strong> ${l.tip}</div>
   <div class="controls">
    <button class="btn secondary" data-action="prevLesson">← Previous</button>
    <button class="btn primary" data-action="completeLesson">${state.completedLessons>=state.lesson+1?"Completed ✓":"Mark as complete"}</button>
    <button class="btn secondary" data-action="nextLesson">Next →</button>
   </div>
  </article>
  <aside class="card">
   <h3>Your lesson progress</h3>
   <p class="muted">${state.lesson+1} / ${lessons.length}</p>
   <div class="progress" style="margin:12px 0"><span style="width:${((state.lesson+1)/lessons.length)*100}%"></span></div>
   ${lessons.map((x,i)=>`<button class="btn small ${i===state.lesson?"primary":"secondary"}" style="width:100%;margin-top:8px;text-align:left" data-lesson="${i}">${i+1}. ${x.title}</button>`).join("")}
  </aside>
 </div>`;
}

function vocabularyPage(){
 const w=words[state.word];
 return `${pageTitle("Daily Vocabulary","Learn five useful words every day. Today’s set is ready below.")}
 <div class="card word-card">
  <span class="badge">${w[5]} • ${w[3]}</span>
  <div class="word">${w[0]}</div>
  <div class="phonetic">/${w[1]}/</div>
  <span class="pos">${w[2]}</span>
  <p><strong>Meaning:</strong> ${w[3]}</p>
  <div class="example"><strong>Example:</strong><br>${w[4]}</div>
  <div class="controls">
   <button class="btn secondary" data-action="speakWord">🔊 Listen</button>
   <button class="btn primary" data-action="nextWord">Next word →</button>
  </div>
 </div>
 <div class="section-head"><div><h3>Today's 5-word target</h3><p class="muted">Words 1–5 are today's core practice.</p></div></div>
 <div class="result-list">${words.slice(0,5).map((x,i)=>`<div class="result-item"><strong>${i+1}. ${x[0]}</strong> — ${x[3]} <span class="muted">(${x[5]})</span></div>`).join("")}</div>`;
}

function speakingPage(){
 const sentences=["My name is Vinith.","I am studying MBA in Finance.","I want to improve my communication skills.","I practise English every day.","I am preparing myself for a corporate career."];
 const i=Number(localStorage.getItem("dl_sentence")||0);
 return `${pageTitle("English Speaking Practice","Speak clearly. Do not worry about small mistakes. Practise again.")}
 <div class="card" style="max-width:800px;margin:auto;text-align:center">
  <span class="badge">SENTENCE ${i+1} / ${sentences.length}</span>
  <h2 style="margin:15px 0">${sentences[i]}</h2>
  <p class="muted">Read this sentence aloud 3 times.</p>
  <div class="controls" style="margin-top:22px">
   <button class="btn primary" data-action="speakSentence">🔊 Listen</button>
   <button class="btn secondary" data-action="nextSentence">Next sentence</button>
  </div>
  <div class="tip" style="text-align:left;margin-top:25px">🎯 Tip: Speak slowly, pronounce each word clearly, and then try once without looking.</div>
 </div>`;
}

function grammarPage(){
 return `${pageTitle("Grammar Practice","Correct common mistakes and improve your everyday English.")}
 <div class="card">
  <h3>Choose the correct sentence</h3>
  <div class="option-list">
   <button class="option" data-grammar="wrong">She go to college every day.</button>
   <button class="option" data-grammar="right">She goes to college every day.</button>
  </div>
  <div id="grammarFeedback" class="muted">Choose one answer.</div>
 </div>
 <div class="card" style="margin-top:18px">
  <h3>Quick rule</h3>
  <p>With <strong>he, she, it</strong> in the simple present tense, the main verb usually takes <strong>-s</strong> or <strong>-es</strong>.</p>
  <p style="margin-top:8px">Example: He works. She studies. It goes.</p>
 </div>`;
}

function quizPage(){
 const q=quizzes[state.quiz];
 return `${pageTitle("Daily Quiz","Answer the question and read the explanation.")}
 <div class="card quiz-card">
  <span class="badge">Question ${state.quiz+1} / ${quizzes.length}</span>
  <h2>${q.q}</h2>
  <div class="option-list">
   ${q.o.map((x,i)=>`<button class="option" data-option="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join("")}
  </div>
  <div id="quizFeedback" class="muted">Choose an answer.</div>
  <div class="controls" style="margin-top:18px"><button class="btn primary" data-action="nextQuiz">Next question →</button></div>
 </div>`;
}

function aiPage(){
 return `${pageTitle("Learning Search","Ask a study question. This offline version gives useful answers for common learning topics.")}
 <div class="search-box">
  <input id="searchInput" placeholder="Try: What is financial management? or What does resilient mean?">
  <button class="btn primary" data-action="search">Search</button>
 </div>
 <div id="searchAnswer" class="answer">Your answer will appear here.</div>
 <div class="section-head"><div><h3>Try these</h3></div></div>
 <div class="result-list">
  <button class="result-item" data-query="What is financial management?">What is financial management?</button>
  <button class="result-item" data-query="What is the meaning of confident?">What is the meaning of confident?</button>
  <button class="result-item" data-query="How can I improve English speaking?">How can I improve English speaking?</button>
 </div>`;
}

function progressPage(){
 const lessonPct=Math.round((state.completedLessons/lessons.length)*100);
 return `${pageTitle("My Progress","Your learning activity is saved in this browser.")}
 <div class="stat-grid">
  <div class="stat-card"><span class="muted">🔥 Current streak</span><div class="num">${state.streak} days</div></div>
  <div class="stat-card"><span class="muted">📚 Lessons</span><div class="num">${state.completedLessons}/${lessons.length}</div></div>
  <div class="stat-card"><span class="muted">🧠 Words</span><div class="num">${state.wordsSeen}</div></div>
 </div>
 <div class="card" style="margin-top:20px">
  <h3>Lesson completion</h3>
  <div class="progress" style="margin:14px 0"><span style="width:${lessonPct}%"></span></div>
  <p>${lessonPct}% complete. Keep your daily learning habit going.</p>
  <button class="btn secondary" style="margin-top:18px" data-action="reset">Reset progress</button>
 </div>`;
}

function bindPageEvents(){
 document.querySelectorAll("[data-page]").forEach(el=>el.addEventListener("click",e=>{
   e.preventDefault(); state.page=el.dataset.page; document.getElementById("mobileMenu").classList.remove("open"); render();
 }));
 document.querySelectorAll("[data-lesson]").forEach(el=>el.onclick=()=>{state.lesson=Number(el.dataset.lesson);render()});
 document.querySelectorAll("[data-option]").forEach(el=>el.onclick=()=>answerQuiz(Number(el.dataset.option),el));
 document.querySelectorAll("[data-grammar]").forEach(el=>el.onclick=()=>grammarAnswer(el.dataset.grammar));
 document.querySelectorAll("[data-query]").forEach(el=>el.onclick=()=>{document.getElementById("searchInput").value=el.dataset.query;searchQuestion()});
 const actionMap={
  start:()=>{state.page="lessons";render()},
  prevLesson:()=>{state.lesson=Math.max(0,state.lesson-1);render()},
  nextLesson:()=>{state.lesson=Math.min(lessons.length-1,state.lesson+1);render()},
  completeLesson:()=>{if(state.completedLessons<state.lesson+1)state.completedLessons=state.lesson+1;save();render()},
  speakWord:()=>speak(words[state.word][0]),
  nextWord:()=>{state.word=(state.word+1)%words.length;state.wordsSeen++;save();render()},
  speakSentence:()=>speak(document.querySelector(".card h2")?.textContent||""),
  nextSentence:()=>{let i=Number(localStorage.getItem("dl_sentence")||0);localStorage.setItem("dl_sentence",(i+1)%5);render()},
  nextQuiz:()=>{state.quiz=(state.quiz+1)%quizzes.length;state.quizAnswered=false;render()},
  search:searchQuestion,
  reset:()=>{state.completedLessons=0;state.wordsSeen=0;state.score=0;save();render()}
 };
 document.querySelectorAll("[data-action]").forEach(el=>el.onclick=()=>actionMap[el.dataset.action]?.());
}

function answerQuiz(i,button){
 if(state.quizAnswered)return;
 const q=quizzes[state.quiz]; state.quizAnswered=true;
 document.querySelectorAll("[data-option]").forEach((b,n)=>{if(n===q.a)b.classList.add("correct")});
 if(i===q.a){state.score++;document.getElementById("quizFeedback").innerHTML=`<span class="success">Correct! ✓</span> ${q.e}`}
 else{button.classList.add("wrong");document.getElementById("quizFeedback").textContent=`Not quite. ${q.e}`}
 save();
}
function grammarAnswer(type){
 const box=document.getElementById("grammarFeedback");
 box.innerHTML=type==="right"?`<span class="success">Correct! ✓</span> “She goes to college every day” is correct.`:"Not correct. With “she”, use “goes”.";
}
function speak(text){
 if("speechSynthesis" in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}
 else alert("Text-to-speech is not supported in this browser.");
}
function searchQuestion(){
 const input=document.getElementById("searchInput"); const out=document.getElementById("searchAnswer");
 if(!input||!out)return;
 const q=input.value.trim().toLowerCase();
 if(!q){out.textContent="Please type a question first.";return}
 let ans="";
 if(q.includes("financial management")) ans="Financial management means planning, obtaining, using and controlling money in a business. Its main decisions are investment, financing and dividend decisions.";
 else if(q.includes("confident")) ans="Confident means feeling sure about your ability. Example: “I am confident about my interview.”";
 else if(q.includes("resilient")) ans="Resilient means able to recover or continue after difficulties. Example: “A resilient student keeps trying after a mistake.”";
 else if(q.includes("improve")&&q.includes("english")) ans="To improve English speaking: practise for 10 minutes daily, learn 5 useful words, speak short sentences, listen and repeat, record your voice, and review your mistakes.";
 else if(q.includes("tally")) ans="TallyPrime is business accounting software used for tasks such as recording transactions, creating invoices, maintaining ledgers and preparing financial reports.";
 else ans="Study tip: Break the topic into small parts, understand the basic definition, learn one example, and then explain the idea in your own words. If you need a specific answer, ask a clear question such as “What is working capital?”";
 out.textContent=ans;
}

document.getElementById("themeBtn").onclick=()=>{
 state.theme=state.theme==="dark"?"light":"dark";
 document.body.classList.toggle("dark",state.theme==="dark");
 save();
 document.getElementById("themeBtn").textContent=state.theme==="dark"?"☀️":"🌙";
};
document.getElementById("themeBtn").textContent=state.theme==="dark"?"☀️":"🌙";
document.getElementById("menuBtn").onclick=()=>document.getElementById("mobileMenu").classList.toggle("open");
render();