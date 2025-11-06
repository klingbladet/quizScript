
const ul = document.getElementById("questions")
let questions = null;
let userAnswers = [];


const QUESTION_LIMIT = 20;

async function getQuizQuestions() {
  try {
    const response = await fetch("questions.json");

    if(!response.ok) {
      throw new Error(`HTTP error ! stats: ${response.status}`);
    }
    const data = await response.json();
    const shuffledData = shuffle(data);
    const limitedQuestions = shuffledData.slice(0, QUESTION_LIMIT);

    return limitedQuestions;

  } catch (error) {
    console.error("Error", error);
    return [];
  }
}

function shuffle(arr) {
  let lastQuestion = arr.length -1;
  
  while(lastQuestion > 0) {
    const randQuestion = Math.floor(Math.random() * (lastQuestion +1));
    [arr[lastQuestion], arr[randQuestion]] = [arr[randQuestion], arr[lastQuestion]];
    lastQuestion -= 1;
  }

  return arr;
}

async function renderHTML(questions) {
  console.log(questions)

  const questionContainer = document.getElementById("question-container");
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
    answerFour.innerText = q.answers[3] || "4";

    // Vänta på att användaren klickar på ett svar innan nästa fråga visas
    const userAnswer = await waitForAnswer([answerOne, answerTwo, answerThree, answerFour]);

    console.log("Du valde:", userAnswer);
    // Här kan du t.ex. kolla om svaret var rätt innan nästa fråga laddas
    if(userAnswer === q.answers[q.correct]) {
      console.log("Korrekt!");
    } else 
      console.log("Fel!");
  }
  
  question.innerText = "Klart! 🎉";
  answerOne.innerText = "";
  answerTwo.innerText = "";
  answerThree.innerText = "";
  answerFour.innerText = "";
}

// Hjälpfunktion som väntar tills ett av svaren klickas
function waitForAnswer(answerElements) {
  return new Promise((resolve) => {
    answerElements.forEach((btn) => {
      const handleClick = () => {
        // ta bort event listeners så det inte klickas flera gånger
        answerElements.forEach((b) => b.removeEventListener("click", handleClick));
        resolve(btn.innerText);
      };
      btn.addEventListener("click", handleClick);
    });
  });
}

async function init() {
  const questions = await getQuizQuestions(); // this sets questions
  renderHTML(questions);
}

init();



/*
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} arr - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
//function shuffle(arr) {
  // 1. Initialize last_index (using JavaScript's camelCase convention)
  // We start from the last element (array.length - 1).
  //let lastIndex = arr.length - 1;

  // 2. Loop backwards while there are elements left to shuffle
  // while (lastIndex > 0) {
    // 3. Pick a random index from 0 up to the current lastIndex
    // Math.random() * (lastIndex + 1) gives a float between 0 and (lastIndex + 1)
    // Math.floor() converts it to an integer (e.g., 0 to 10 if lastIndex is 10)
  //  const randIndex = Math.floor(Math.random() * (lastIndex + 1));

    // 4. Swap the element at lastIndex with the element at randIndex
    // This is the modern, clean "destructuring" way to swap in JavaScript
  //  [arr[lastIndex], arr[randIndex]] = [arr[randIndex], arr[lastIndex]];

    /* // This is the traditional swap, just like your Python 'temp' variable
    let temp = arr[lastIndex];
    arr[lastIndex] = arr[randIndex];
    arr[randIndex] = temp;
    */

    // 5. Move to the previous element
  //  lastIndex -= 1;
 // }

  // Return the array, which has been modified in place
 // return arr;
//}

/*
def shuffle(arr):
while last_index > 0:
   rand_index = random.randint(0, last_index)
   temp = arr[last_index] 
   arr[last_index]= arr[rand_index]
   arr[rand_rand_index] = temp
   last_index -= 1
*/


// 2. THE "GLUE" FUNCTION TO FETCH, SHUFFLE, AND START
// =====================================================
/**
 * Fetches the questions, shuffles them, and selects 20
 */

/*
async function getQuizQuestions() {
  console.log("Starting quiz... Fetching questions...");

  try {
    // --- THIS IS THE FETCH PART ---
    // 'await' pauses the function until fetch gets a response
    const response = await fetch('questions.json'); 
    
    // Check if the file was found and the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // --- THIS IS THE JSON PART ---
    // 'await' pauses until the .json() method is done parsing
    const allQuestions = await response.json(); 
    console.log(`Successfully fetched ${allQuestions.length} questions.`);

    // --- THIS IS THE SHUFFLE PART ---
    // Now you just use your 'allQuestions' array
    const shuffledQuestions = shuffle(allQuestions);

    // --- THIS IS THE SLICE PART ---
    const twentyRandomQuestions = shuffledQuestions.slice(0, 20);

    // Now you have your 20 unique random questions!
    console.log("Here are your 20 random questions:");
    console.log(twentyRandomQuestions);

    // You would then call your function to display them
    // displayQuiz(twentyRandomQuestions);

  } catch (error) {
    // Handle any errors (e.g., file not found, invalid JSON)
    console.error("Could not load the quiz:", error);
  }
}

// 3. START THE PROCESS
// ====================
getQuizQuestions();
*/