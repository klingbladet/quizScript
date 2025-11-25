import { saveResultToLocal, loadResults } from "./quizStorage.js";
import { playSound, spawnFX } from "./scripts/effects.js";
import { showstart, countdownDisplay, startButton, leaderboardButton, pauseBtn, resumeBtn, overlay, pauseWarning, timeoutElement, inputElement } from "./scripts/dom.js";
import { startCountdown, updateCountdown, TOTAL_TIME_SECONDS, countdownTime, state, togglePause, countdownInterval } from "./scripts/timer.js";
import { draw } from "./scripts/matrix.js";
import { getQuizQuestions } from "./scripts/questions.js";
import { showLeaderboard } from "./scripts/leaderBoard.js";

console.log("Script loaded successfully.");

let questions = [];
let userAnswers = [];
let userName = "";
let correctCount = 0;

let rigthToPause = false;
let pendingPause = false;
let resumeResolve;


showstart.classList.add("show-start");

function getUserName() {
  userName = inputElement.value;
  console.log("The user name is:", userName);
}

inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        document.getElementById('start-button').click();
    }
});

startButton.addEventListener("click", startCountdown);
startButton.addEventListener("click", startshow);
startButton.addEventListener("click", resultatRestartGame);

document.getElementById("restart-button").addEventListener("click", restartQuiz);

document.getElementById("leaderboard-button").addEventListener("click", showLeaderboard);

document.getElementById("close-leaderboard").addEventListener("click", () => {
  document.getElementById("leaderboard-container").classList.add("hidden");
});

pauseBtn.addEventListener("click", () => {
  if (!rigthToPause) {
    pauseWarning.classList.remove("hidden");
    pendingPause = true;
    return;
  }

  togglePause();

  if (state.isPaused) showPausePopup();
  else {
    hidePausePopup();
    resume();
  }
});


resumeBtn.addEventListener("click", () => {
  state.isPaused = false;
  hidePausePopup();
  resume();
});


function resultatRestartGame() {
  document.getElementById("result-container").classList.add("hidden");
  startCountdown();
  init();
}

function waitForAnswer(answerElements) {
  return new Promise((resolve) => {
    answerElements.forEach((btn, index) => {
      const handleClick = () => {
        rigthToPause = true;
        pauseWarning.classList.add("hidden");
        answerElements.forEach((b) => b.removeEventListener("click", handleClick));
        resolve(index);
      };
      btn.addEventListener("click", handleClick);
    });
  });
}

function waitForUnpause() {
  if (!state.isPaused) return Promise.resolve();

  return new Promise(r => {
    resumeResolve = r;
  });
}

function resume() {
  if (resumeResolve) {
    resumeResolve();
    resumeResolve = null;
  }
}

function showPausePopup() {
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => overlay.classList.add("show"));
}

function hidePausePopup() {
  overlay.classList.remove("show");
  setTimeout(() => overlay.classList.add("hidden"), 350);
}

async function renderHTML() {
  pauseBtn.classList.remove("hidden");
  userAnswers = [];

  const answerElements = [
    document.getElementById("answer-one"),
    document.getElementById("answer-two"),
    document.getElementById("answer-three"),
    document.getElementById("answer-four")
  ];

  const questionElement = document.getElementById("question");

  for (const q of questions) {
    questionElement.textContent = q.question;

    q.answers.forEach((answer, i) => {
      answerElements[i].textContent = answer;
      answerElements[i].classList.add("answers");
    });

    const chosenIndex = await waitForAnswer(answerElements);
    userAnswers.push(chosenIndex);

    const chosenElement = answerElements[chosenIndex];
    const correctIndex = q.correct;
    const correctElement = answerElements[correctIndex];

    answerElements.forEach(el => el.classList.remove("answers"));

    if (chosenIndex === correctIndex) {
      playSound("correct");
      chosenElement.classList.add("correct");
      correctCount++;
    } else {
      playSound("wrong");
      chosenElement.classList.add("wrong");
      correctElement.classList.add("correct");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (pendingPause) {
      pendingPause = false;
      state.isPaused = true;
      showPausePopup();
    }
    await waitForUnpause();

    rigthToPause = false;

    chosenElement.classList.remove("correct", "wrong");
    correctElement.classList.remove("correct");
    void chosenElement.offsetWidth;
    void correctElement.offsetWidth;
  }

  endQuiz();
}

async function endQuiz(timeOut = false) {
  clearInterval(countdownInterval);

  const resultContainer = document.getElementById("result-container");
  const questionContainer = document.getElementById("question-container");
  questionContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  leaderboardButton.classList.remove("hidden");
  document.getElementById("restart-button").classList.remove("hidden");

  const timeUsed = `${Math.floor((TOTAL_TIME_SECONDS - countdownTime) / 60)} min ${(TOTAL_TIME_SECONDS - countdownTime) % 60} sek`;
  const timeRemaining = countdownTime;

  const percent = correctCount / questions.length * 100;

  if (percent < 60) {
    playSound("shame");
    spawnFX("bad");
  } else if (percent < 80) {
    playSound("applause");
    spawnFX("mid");
  } else {
    playSound("champion");
    spawnFX("good");
  }

  document.getElementById("score").innerHTML = `
    <strong>Du fick ${correctCount} av ${questions.length} rätt!</strong><br>
    ${timeOut ? "⏰ Tiden tog slut!" : ""}
    <br><br>
    <strong>Tid använd:</strong> ${timeUsed}<br>
    <strong>Tid kvar:</strong> ${Math.floor(timeRemaining / 60)} min ${timeRemaining % 60} sek
  `;

  await saveResultToLocal(correctCount, questions, timeUsed, timeRemaining, userName);
}

function startshow() {
  const startshow = document.getElementById("question-container");
  startshow.classList.remove("hidden");
  getUserName();

  const leaderboard = document.getElementById("leaderboard-container");
  if (!leaderboard.classList.contains("hidden")) leaderboard.classList.add("hidden");

  leaderboardButton.classList.add("hidden");
  renderHTML();

  document.querySelector(".userDiv").textContent = userName; //skapar div user
}

async function init() {
  correctCount = 0;
  const fetchedQuestions = await getQuizQuestions();
  if (fetchedQuestions.length > 0) questions = fetchedQuestions;
  else console.error("Inga frågor kunde hämtas.");
}

function restartQuiz() {
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("score").innerHTML = "";

  const restartBtn = document.getElementById("restart-button");
  restartBtn.classList.add("hidden");

  leaderboardButton.classList.remove("hidden");
  startButton.style.display = "flex";

  init();
}












init();



setInterval(draw, 35);




