console.log("Script loaded successfully.");

// Avsluta quiz och räkna resultat
function endQuiz(timeOut = false) {
  clearInterval(timer);
  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - startTime) / 1000); // sekunder

  // Räkna rätt svar
  let correctCount = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) correctCount++;
  });

  // Visa resultat
  document.querySelector(".quiz-container").classList.add("hidden");
  const resultContainer = document.getElementById("result-container");
  resultContainer.classList.remove("hidden");

  const timeUsed = `${Math.floor(timeTaken / 60)} min ${timeTaken % 60} sek`;
  const timeRemaining = `${Math.floor(timeLeft / 60)} min ${timeLeft % 60} sek`;

  document.getElementById("score").innerHTML = `
    <strong>Du fick ${correctCount} av ${questions.length} rätt!</strong><br>
    ${timeOut ? "⏰ Tiden tog slut!" : ""}
    <br><br>
    <strong>Tid använd:</strong> ${timeUsed}<br>
    <strong>Tid kvar:</strong> ${timeRemaining}
  `;
    // Spara resultat i LocalStorage
  const previousResults = JSON.parse(localStorage.getItem("quizResults")) || [];
  previousResults.push({
    date: new Date().toLocaleString(),
    score: correctCount,
    total: questions.length,
    timeUsed: timeUsed,
    timeRemaining: timeRemaining
  });
  localStorage.setItem("quizResults", JSON.stringify(previousResults));
}