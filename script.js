console.log("Script loaded successfully.");




//Timer**

const countdownDisplay = document.getElementById('countdown-display');
const startButton = document.getElementById('start-button');

const TOTAL_TIME_SECONDS = 600; // totala tid

let countdownTime = TOTAL_TIME_SECONDS; //nuvarande tid
let countdownInterval; //kontroll nyckel, stoppar timern och gör så att man kan börja om

function formatTime(totalSeconds) { //totalSeconds
    const minutes = Math.floor(totalSeconds / 60); //visar minuter
    const seconds = totalSeconds % 60; //visar återstende sekunder

    const formattedMinutes = minutes.toString().padStart(2, '0'); //gör så att den alltid visar två siffror minuter, ex 9 min visar 09 på timern
    const formattedSeconds = seconds.toString().padStart(2, '0'); //gör så att den alltid visar två siffror sekunder, ex 9 sek visar 09 på timern

    return `${formattedMinutes}:${formattedSeconds}`;
}

function updateCountdown() {
    countdownTime--; //Förkortning för variabel - 1, gör att sekundrarna räknas ner en sek i taget.

    countdownDisplay.textContent = formatTime(countdownTime); //Kallar på formatTime funktionen och visar nedräkningen per sekund i div texten.
    
    if (countdownTime <= 0) {
        clearInterval(countdownInterval); //Stoppar och rensar intervallet, tillåter att den kan börjar om igen.
        countdownDisplay.textContent = "Tiden är ute! Vill du börja om?"; //Visar text stringen när timern tagit slut.
        startButton.style.display = ''; //Återaktiverar knappen så att timern kan räkna ner igen.
        startButton.textContent = 'Börja om';
        countdownTime = TOTAL_TIME_SECONDS; //Återställer till 10 min.
    }
}

function startCountdown() {
    clearInterval(countdownInterval);
    countdownTime = TOTAL_TIME_SECONDS; //Återställer timern.
    startButton.style.display = 'none'; //Gömmer start knappen
    countdownDisplay.textContent = formatTime(countdownTime); //Kallar på formatTime funktionen och visar nedräkningen per sekund i div texten.
    countdownInterval = setInterval(updateCountdown, 1000); //1000 behövs för att det faktist ska gå en sekund mellan varje ändring.
}

startButton.addEventListener('click', startCountdown);

//**