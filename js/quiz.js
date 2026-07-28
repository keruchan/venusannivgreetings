/* =========================================================
   Quiz gate — a cute "only she'd know the answers" lock
   screen shown before the site is revealed. No backend / DB:
   the pass state just lives in localStorage on her device.
   Edit QUIZ_QUESTIONS to change the questions or answers.
   ========================================================= */

const QUIZ_PASS_KEY = "anniversary_quiz_passed";

const QUIZ_QUESTIONS = [
  { question: "Sinong nagfirst move?", choices: ["Venus", "Joshua"], correct: 0 },
  { question: "Anong favorite color ko?", choices: ["Black", "Blue", "White"], correct: 1 },
  { question: "Anong favorite prutas ko?", choices: ["Apple", "Saging", "Avocado", "Grapes"], correct: 2 },
];

(function quizGate() {
  const gate = document.getElementById("quiz-gate");
  if (!gate) return;

  if (localStorage.getItem(QUIZ_PASS_KEY) === "true") {
    gate.remove();
    return;
  }

  document.body.style.overflow = "hidden";

  const card = gate.querySelector(".quiz-card");
  const progressEl = document.getElementById("quiz-progress");
  const questionEl = document.getElementById("quiz-question");
  const choicesEl = document.getElementById("quiz-choices");
  const feedbackEl = document.getElementById("quiz-feedback");

  QUIZ_QUESTIONS.forEach(() => progressEl.appendChild(document.createElement("span")));

  let qIndex = 0;

  function renderQuestion() {
    const item = QUIZ_QUESTIONS[qIndex];
    questionEl.textContent = item.question;
    feedbackEl.textContent = "";
    feedbackEl.classList.remove("good");
    choicesEl.innerHTML = "";

    item.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-choice-btn";
      btn.textContent = choice;
      btn.addEventListener("click", () => handleAnswer(i, btn));
      choicesEl.appendChild(btn);
    });

    Array.from(progressEl.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === qIndex);
      dot.classList.toggle("done", i < qIndex);
    });
  }

  function handleAnswer(i, btn) {
    const item = QUIZ_QUESTIONS[qIndex];
    if (i === item.correct) {
      btn.classList.add("correct");
      feedbackEl.textContent = "Yes! 💕";
      feedbackEl.classList.add("good");
      Array.from(choicesEl.children).forEach((b) => (b.disabled = true));
      setTimeout(() => {
        qIndex++;
        if (qIndex < QUIZ_QUESTIONS.length) {
          renderQuestion();
        } else {
          finishQuiz();
        }
      }, 700);
    } else {
      btn.classList.remove("wrong");
      void btn.offsetWidth;
      btn.classList.add("wrong");
      feedbackEl.textContent = "Hmm, try again 😅";
      feedbackEl.classList.remove("good");
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      setTimeout(() => btn.classList.remove("wrong"), 500);
    }
  }

  function finishQuiz() {
    try {
      localStorage.setItem(QUIZ_PASS_KEY, "true");
    } catch {}

    questionEl.textContent = "You're in! 💖";
    choicesEl.innerHTML = "";
    feedbackEl.textContent = "Happy anniversary, my love.";
    feedbackEl.classList.add("good");

    if (window.__burstConfetti) {
      window.__burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
    }

    setTimeout(() => {
      gate.classList.add("unlocking");
      document.body.style.overflow = "";
      setTimeout(() => gate.remove(), 700);
    }, 1100);
  }

  renderQuestion();
})();
