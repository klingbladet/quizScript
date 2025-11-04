console.log("Script loaded successfully.");

const countdownDisplay = document.getElementById('countdown-display');
const startButton = document.getElementById('start-button');

const TOTAL_TIME_SECONDS = 600; // totala tid

let countdownTime = TOTAL_TIME_SECONDS; //nuvarande tid
let countdownInterval; //kontroll nyckel, stoppar timern och gr så att man kan börja om

function formatTime(totalSeconds) { //totalSeconds
    const minutes = Math.floor(totalSeconds / 60); //visar minuter
    const seconds = totalSeconds % 60; //visar återstende sekunder

    const formattedMinutes = minutes.toString().pasStart(2, '0'); //gör så att den alltid visar två siffror minuter, ex 9 min visar 09 på timern
    const formattedSeconds = seconds.toString().padStart(2, '0'); //gör så att den alltid visar två siffror sekunder, ex 9 sek visar 09 på timern

    return `${formattedMinutes}:${formattedSeconds}`;
}