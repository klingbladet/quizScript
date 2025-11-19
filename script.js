import { saveResultToLocal, loadResults } from "./quizStorage.js";

console.log("Script loaded successfully.");

let questions = [];
let userAnswers = [];
let userName = "";
let inputElement = document.querySelector('.user-name');

function getUserName() {

  userName = inputElement.value;
  console.log('The user name is:', userName);
}

const showstart = document.getElementById("start-button");
showstart.classList.add("show-start");

// statisk timer–variabel (för framtida användning)
// let timeLeft = 600; // 2 minuter t.ex.

const countdownDisplay = document.getElementById("countdown-display");
const startButton = document.getElementById("start-button");
const leaderboardButton = document.getElementById("leaderboard-button");
const timeoutElement = document.querySelector(".timeout");


const TOTAL_TIME_SECONDS = 600; // totala tid

let countdownTime = TOTAL_TIME_SECONDS; //nuvarande tid
let countdownInterval; //kontroll nyckel, stoppar timern och gör så att man kan börja om
const QUESTION_LIMIT = 10;

//Timer**
function formatTime(totalSeconds) {
  //totalSeconds
  const minutes = Math.floor(totalSeconds / 60); //visar minuter
  const seconds = totalSeconds % 60; //visar återstende sekunder

  const formattedMinutes = minutes.toString().padStart(2, "0"); //gör så att den alltid visar två siffror minuter, ex 9 min visar 09 på timern
  const formattedSeconds = seconds.toString().padStart(2, "0"); //gör så att den alltid visar två siffror sekunder, ex 9 sek visar 09 på timern

  return `${formattedMinutes}:${formattedSeconds}`;
}

function updateCountdown() {
  countdownTime--; //Förkortning för variabel - 1, gör att sekundrarna räknas ner en sek i taget.

  countdownDisplay.textContent = formatTime(countdownTime); //Kallar på formatTime funktionen och visar nedräkningen per sekund i div texten.

  if (countdownTime <= 0) {
    clearInterval(countdownInterval); //Stoppar och rensar intervallet, tillåter att den kan börjar om igen.
    startButton.style.display = "flex"; //Återaktiverar knappen så att timern kan räkna ner igen.
    startButton.textContent = "Börja om";
    countdownTime = TOTAL_TIME_SECONDS; //Återställer till 10 min.
    timeoutElement.style.display = "flex"; //Visar text stringen när timern tagit slut.
    const questioncontainer = document.getElementById("question-container");
    questioncontainer.classList.add("hidden");
  }
}

function startCountdown() {
  clearInterval(countdownInterval);
  countdownTime = TOTAL_TIME_SECONDS; //Återställer timern.
  startButton.style.display = "none"; //Gömmer start knappen
  // startButton.classList.add("hidden"); //Gömmer start knappen
  countdownDisplay.textContent = formatTime(countdownTime); //Kallar på formatTime funktionen och visar nedräkningen per sekund i div texten.
  countdownInterval = setInterval(updateCountdown, 1000); //1000 behövs för att det faktist ska gå en sekund mellan varje ändring.
  timeoutElement.style.display = "none"; //Tar bort text stringen när timern börjar om.
  inputElement.style.display = "none";
}

inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // Stop the Enter key from triggering any default browser action (like form submission)
        event.preventDefault(); 
        
        // Bonus: Automatically trigger the start button's actions as well
        // Since your start button already triggers startCountdown, startshow, and resultatRestartGame
        // it's good practice to programmatically click it to maintain a single source of truth.
        document.getElementById('start-button').click();
    }
});

function startshow() {
  
  const startshow = document.getElementById("question-container");
  startshow.classList.remove("hidden");
  getUserName();

  // Göm leaderboard om den är synlig
  const leaderboard = document.getElementById("leaderboard-container");
  if (!leaderboard.classList.contains("hidden")) {
    leaderboard.classList.add("hidden");
  }
  leaderboardButton.classList.add("hidden"); //Gömmer leaderboard knappen när quizet startas.
}

function resultatRestartGame() {
  const resultContainer = document.getElementById("result-container");
  resultContainer.classList.add("hidden");
  startCountdown();
  init();
}

startButton.addEventListener("click", startCountdown);
startButton.addEventListener("click", startshow);
startButton.addEventListener("click", resultatRestartGame);

async function getQuizQuestions() {
  try {
    const response = await fetch("questions.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const shuffledData = shuffle(data);
    const limitedQuestions = shuffledData.slice(0, QUESTION_LIMIT);

    return limitedQuestions;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function shuffle(arr) {
  let lastQuestion = arr.length - 1;
  while (lastQuestion > 0) {
    const randQuestion = Math.floor(Math.random() * (lastQuestion + 1));
    [arr[lastQuestion], arr[randQuestion]] = [arr[randQuestion], arr[lastQuestion]];
    lastQuestion -= 1;
  }
  return arr;
}

async function renderHTML(questionsData) {
  questions = questionsData;
  userAnswers = [];

  const question = document.getElementById("question");
  const answerOne = document.getElementById("answer-one");
  const answerTwo = document.getElementById("answer-two");
  const answerThree = document.getElementById("answer-three");
  const answerFour = document.getElementById("answer-four");

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    question.innerText = q.question;
    answerOne.innerText = q.answers[0];
    answerTwo.innerText = q.answers[1];
    answerThree.innerText = q.answers[2];
    answerFour.innerText = q.answers[3];

    const userAnswer = await waitForAnswer([answerOne, answerTwo, answerThree, answerFour]);
    userAnswers.push(userAnswer);

    // if-sats ska bort eftråt då den endast visar i konsolen om svaret var rätt eller fel.
    if (userAnswer === q.answers[q.correct]) {
      console.log("Korrekt!");
    } else {
      console.log("Fel!");
    }
  }

  endQuiz(); // Kör när alla frågor är besvarade
}

function waitForAnswer(answerElements) {
  return new Promise((resolve) => {
    answerElements.forEach((btn) => {
      const handleClick = () => {
        answerElements.forEach((b) => b.removeEventListener("click", handleClick));
        resolve(btn.innerText);
      };
      btn.addEventListener("click", handleClick);
    });
  });
}

// Avsluta quiz och räkna resultat
// ============================
async function endQuiz(timeOut = false) {
  // --- Timer bortkommenterad tills vidare ---
  clearInterval(countdownInterval);

  let correctCount = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answers[q.correct]) correctCount++;
  });

  const resultContainer = document.getElementById("result-container");
  const questionContainer = document.getElementById("question-container");
  questionContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  leaderboardButton.classList.remove("hidden"); //Visar leaderboard knappen när quizet är slut
  const restartBtn = document.getElementById("restart-button");
  restartBtn.classList.remove("hidden");

  const timeUsed = `${Math.floor((TOTAL_TIME_SECONDS - countdownTime) / 60)} min ${(TOTAL_TIME_SECONDS - countdownTime) % 60} sek`;
  const timeRemaining = countdownTime; // numeriskt för enklare sortering

  document.getElementById("score").innerHTML = `
    <strong>Du fick ${correctCount} av ${questions.length} rätt!</strong><br>
    ${timeOut ? "⏰ Tiden tog slut!" : ""}
    <br><br>
    <strong>Tid använd:</strong> ${timeUsed}<br>
    <strong>Tid kvar:</strong> ${Math.floor(timeRemaining / 60)} min ${timeRemaining % 60} sek
  `;
  
  // spara via modul i localStorage + Firebase
  await saveResultToLocal(correctCount, questions, timeUsed, timeRemaining, userName);
}

async function init() {
  const fetchedQuestions = await getQuizQuestions();
  if (fetchedQuestions.length > 0) {
    renderHTML(fetchedQuestions);
  } else {
    console.error("Inga frågor kunde hämtas.");
  }
}

function restartQuiz() {
  // Göm resultat
  document.getElementById("result-container").classList.add("hidden");

  // Töm resultattext
  document.getElementById("score").innerHTML = "";

  // Göm restart-knappen
  const restartBtn = document.getElementById("restart-button");
  restartBtn.classList.add("hidden");

  // Visa leaderboard-knappen igen om du vill
  leaderboardButton.classList.remove("hidden");
  // startButton.classList.remove("hidden");
  startButton.style.display = "flex";

  // Starta om timer + quiz

  init();
}

document.getElementById("restart-button").addEventListener("click", restartQuiz);


// Hämta topp 10 från localStorage och visa
async function showLeaderboard() {
  const container = document.getElementById("leaderboard-container");
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";

  // 🔹 Hämta resultat via modulen (hämtar från localStorage och ev. Firebase)
  const results = await loadResults();

  if (!results || results.length === 0) {
    list.innerHTML = `<li>Inga resultat hittades ännu.</li>`;
    container.classList.remove("hidden");
    return;
  }

  // 🔹 Sortera efter score (desc), sen timeRemaining (desc)
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.timeRemaining - a.timeRemaining;
  });

  const topTen = results.slice(0, 10);

  // 🔹 Skapa HTML-rader för top 10
  topTen.forEach((r, i) => {
    const li = document.createElement("li");

    // 🔹 Tilldela klass för topp 3
    if (i === 0) li.classList.add("firstRanked");
    else if (i === 1) li.classList.add("secondRanked");
    else if (i === 2) li.classList.add("thirdRanked");
    else li.classList.add("ranked"); // vanlig klass för resten

    // 🔹 Sätt HTML – topp 3 har medalj, resten får platsnummer
    let rankDisplay;
    if (i === 0) rankDisplay = "🥇";
    else if (i === 1) rankDisplay = "🥈";
    else if (i === 2) rankDisplay = "🥉";
    else rankDisplay = `#${i + 1}`;

    li.innerHTML = `
      <span class="rank">${rankDisplay}</span>
      <span class="user">${r.userName || "Anonym"}</span>
      <span class="score">${r.score}/${r.total} – ${r.timeUsed}</span>
    `;

    list.appendChild(li);
  });

  container.classList.remove("hidden");
  document.getElementById("question-container").classList.add("hidden");
  document.getElementById("result-container").classList.add("hidden");
}


// Göm leaderboard
document.getElementById("close-leaderboard").addEventListener("click", () => {
  document.getElementById("leaderboard-container").classList.add("hidden");
});

// Knapp för att visa leaderboard
document.getElementById("leaderboard-button").addEventListener("click", showLeaderboard);

init();


// geting canvas by Boujjou Achraf
        var c = document.getElementById("c");
        var ctx = c.getContext("2d");

        //making the canvas full screen
        c.height = window.innerHeight;
        c.width = window.innerWidth;

        //chinese characters - taken from the unicode charset
        var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        //converting the string into an array of single characters
        matrix = matrix.split("");

        var font_size = 10;
        var columns = c.width/font_size; //number of columns for the rain
        //an array of drops - one per column
        var drops = [];
        //x below is the x coordinate
        //1 = y co-ordinate of the drop(same for every drop initially)
        for(var x = 0; x < columns; x++)
            drops[x] = 1; 

        //drawing the characters
        function draw()
        {
            if  (paused) return;
            //Black BG for the canvas
            //translucent BG to show trail
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, c.width, c.height);

            ctx.fillStyle = "#cd7f32";//green text
            ctx.font = font_size + "px arial";
            //looping over drops
            for(var i = 0; i < drops.length; i++)
            {
                //a random chinese character to print
                var text = matrix[Math.floor(Math.random()*matrix.length)];
                //x = i*font_size, y = value of drops[i]*font_size
                ctx.fillText(text, i*font_size, drops[i]*font_size);

                //sending the drop back to the top randomly after it has crossed the screen
                //adding a randomness to the reset to make the drops scattered on the Y axis
                if(drops[i]*font_size > c.height && Math.random() > 0.975)
                    drops[i] = 0;

                //incrementing Y coordinate
                drops[i]++;
            }
        }

        setInterval(draw, 35);

        let paused = false;

document.getElementById("pauseBtn").addEventListener("click", function () {
    paused = !paused;
    this.textContent = paused ? "Resume" : "Pause";
});