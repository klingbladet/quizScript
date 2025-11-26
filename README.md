# 🎮 Project Quiz Team 4

A web-based **quiz application** built with HTML, CSS, and JavaScript.  
The project uses **JSON** for quiz questions, **LocalStorage** for local persistence, and **Firebase** for leaderboard and results storage.

---

## 🚀 Features

- **Dynamic Questions**: Loaded from `questions.json` and shuffled.  
- **Answer Handling**:  
  - Correct/incorrect answers highlighted in the UI  
  - Points calculated automatically  
  - Sound and visual effects (`playSound`, `spawnFX`)  
- **Timer**:  
  - Countdown from 3 minutes (`TOTAL_TIME_SECONDS = 180`)  
  - Pause stops both timer and game logic  
- **Pause**:  
  - Freezes the game with overlay (`showPausePopup`)  
  - `waitForUnpause()` resumes gameplay  
- **Leaderboard**:  
  - Results saved to **LocalStorage** and **Firebase**  
  - Top scores displayed dynamically  
- **User Handling**: Set a username (`setUserName`) and track points  

---

## 🗂️ Project Structure

Project-quiz-team-4/
├─ index.html             # Main page
├─ style.css              # Basic styling
├─ questions.json         # Quiz questions & answers
├─ firebaseConfig.json    # Firebase credentials
├─ scripts/
│   ├─ game.js            # Main logic, quiz loop, answer handling
│   ├─ timer.js           # Timer functions
│   ├─ questions.js       # Fetches & shuffles questions
│   ├─ leaderboard.js     # Displays top scores
│   ├─ dom.js             # DOM element references
│   ├─ effects.js         # Sound & visual effects
│   └─ quizStorage.js     # LocalStorage & Firebase integration
└─ README.md

---

## 🧩 Flow / Logic

1. **Init & Start**  
   - Load questions from `questions.json`  
   - Reset score and user data  

2. **Render Question**  
   - Display question + answer buttons  
   - Wait for user input (`waitForAnswer`)  

3. **Answer Handling**  
   - Check correct/incorrect answers  
   - Update score (`correctCount`)  
   - Trigger sound and visual effects (`playSound`, `spawnFX`)  

4. **Timer & Pause**  
   - Countdown using `setInterval`  
   - Pause freezes the quiz & timer (`state.isPaused = true`)  
   - `waitForUnpause()` resumes the game  

5. **Next Question / End**  
   - End → `endQuiz()`  
   - Save results (`saveResultToLocal()`)  
   - Show leaderboard  

---

## 🖼️ Visual Overview

[ questions.json ]
       ↓
[ Init / Start ] → Reset state & score
       ↓
[ Render Question ] → Wait for answer
       ↓
[ Answer Handling ] → Check correctness, update score, play effects
       ↓
[ Timer & Pause ] ← Pause stops quiz + timer
       ↓
[ Next Question / End ] → Save to LocalStorage + Firebase
       ↓
[ Leaderboard ] → Display top scores

---

## ⚡ Technical Overview

- **Frontend**: HTML, CSS, Vanilla JS  
- **Data**:  
  - Questions: `questions.json`  
  - Leaderboard: Firebase + LocalStorage  
- **Event-driven**:  
  - Answer click → resolves `Promise` → next step  
  - Pause → resolves `Promise` when resumed  

---

## 🛠️ Installation

1. Clone the repository:  
   git clone https://github.com/Housame-Oueslati/Project-quiz-team-4.git  

2. Open `index.html` in a web browser  

---

## 💡 Usage

- Click **Start** to begin the quiz  
- Select an answer for each question  
- Pause anytime with the **Pause** button  
- View your score at the end and see your position in the **Leaderboard**  

---

## 📌 Notes

- Questions can be updated directly in `questions.json`  
- Leaderboard requires Firebase credentials (`firebaseConfig.json`)  
- LocalStorage is used for offline result persistence  

---

## 🏆 License

MIT License
