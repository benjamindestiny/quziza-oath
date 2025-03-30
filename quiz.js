// const questionElement = document.getElementById('question');
// const answersContainer = document.getElementById('answers');
// const nextButton = document.getElementById('next-btn');
// const scoreElement = document.getElementById('score'); // Assuming you have an element to display the score

// let score = 0; // Initialize the score

// // Fetch question from Open Trivia Database API
// async function fetchQuestion() {
//   try {
//     const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple'; // Fetches 1 multiple-choice question
//     const response = await fetch(apiUrl);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();

//     if (data.response_code !== 0 || !data.results || data.results.length === 0) {
//       throw new Error('No questions found in the API response.');
//     }

//     return data.results[0];
//   } catch (error) {
//     console.error('Error fetching question:', error);
//     throw error;
//   }
// }

// // Shuffle array (for shuffling answer options)
// function shuffleArray(array) {
//   return array.sort(() => Math.random() - 0.5);
// }

// // Display question and answers
// async function displayQuestion() {
//   const questionData = await fetchQuestion();

//   questionElement.innerHTML = decodeHTML(questionData.question);
//   const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer];
//   const shuffledAnswers = shuffleArray(allAnswers);

//   answersContainer.innerHTML = '';
//   shuffledAnswers.forEach(answer => {
//     const button = document.createElement('button');
//     button.textContent = decodeHTML(answer);
//     button.addEventListener('click', () => checkAnswer(button, questionData.correct_answer));
//     answersContainer.appendChild(button);
//   });
// }

// // Check if the selected answer is correct
// function checkAnswer(selectedButton, correctAnswer) {
//   const buttons = answersContainer.querySelectorAll('button');
//   const correctAnswerDecoded = decodeHTML(correctAnswer);

//   if (selectedButton.textContent === correctAnswerDecoded) {
//     // Correct answer
//     selectedButton.style.backgroundColor = '#4caf50'; // Green
//     selectedButton.style.color = '#ffffff'; // White text
//     alert('You are correct!');
//     score += 5; // Add 5 points to the score
//   } else {
//     // Incorrect answer
//     selectedButton.style.backgroundColor = '#f44336'; // Red
//     alert(`You missed that! The correct answer is "${correctAnswerDecoded}".`);
//     score -= 5; // Deduct 5 points from the score
//   }

//   // Update the score display
//   scoreElement.textContent = `Score: ${score}`;

//   // Highlight correct answer and disable all buttons
//   buttons.forEach(btn => {
//     if (btn.textContent === correctAnswerDecoded) {
//       btn.style.backgroundColor = '#4caf50'; // Green
//       btn.style.color = '#ffffff'; // White text
//     }
//     btn.disabled = true;
//   });
// }

// // Decode HTML entities (like &quot; or &amp;)
// function decodeHTML(html) {
//   const txt = document.createElement('textarea');
//   txt.innerHTML = html;
//   return txt.value;
// }

// // Load first question and set up next button
// displayQuestion();
// nextButton.addEventListener('click', () => {
//   displayQuestion();
//   // Optionally, you can reset the score or add other logic here
// });

// // Initialize the score display
// scoreElement.textContent = `Score: ${score}`;



const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
let score = 0;

// Create feedback popup element
const feedbackPopup = document.createElement('div');
feedbackPopup.id = 'feedback-popup';
document.body.appendChild(feedbackPopup);

// Fetch question from Open Trivia Database API
async function fetchQuestion() {
  try {
    const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code !== 0 || !data.results || data.results.length === 0) {
      throw new Error('No questions found in the API response.');
    }

    return data.results[0];
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
}

// Shuffle array (for shuffling answer options)
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Show feedback popup
function showFeedback(isCorrect, correctAnswer = '') {
  feedbackPopup.textContent = isCorrect ? '✅ Correct!' : `❌ Incorrect! The correct answer is: ${correctAnswer}`;
  feedbackPopup.className = isCorrect ? 'feedback-popup correct' : 'feedback-popup incorrect';
  
  // Show the popup
  feedbackPopup.style.display = 'block';
  feedbackPopup.style.opacity = '1';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    feedbackPopup.style.opacity = '0';
    setTimeout(() => {
      feedbackPopup.style.display = 'none';
    }, 500);
  }, 3000);
}

// Display question and answers
async function displayQuestion() {
  const questionData = await fetchQuestion();

  questionElement.innerHTML = decodeHTML(questionData.question);
  const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer];
  const shuffledAnswers = shuffleArray(allAnswers);

  answersContainer.innerHTML = '';
  shuffledAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = decodeHTML(answer);
    button.addEventListener('click', () => checkAnswer(button, questionData.correct_answer));
    answersContainer.appendChild(button);
  });
}

// Check if the selected answer is correct
function checkAnswer(selectedButton, correctAnswer) {
  const buttons = answersContainer.querySelectorAll('button');
  const correctAnswerDecoded = decodeHTML(correctAnswer);

  if (selectedButton.textContent === correctAnswerDecoded) {
    // Correct answer
    selectedButton.style.backgroundColor = '#4caf50';
    selectedButton.style.color = '#ffffff';
    score += 5;
    showFeedback(true);
  } else {
    // Incorrect answer
    selectedButton.style.backgroundColor = '#f44336';
    score -= 5;
    showFeedback(false, correctAnswerDecoded);
  }

  // Update the score display
  scoreElement.textContent = `Score: ${score}`;

  // Highlight correct answer and disable all buttons
  buttons.forEach(btn => {
    if (btn.textContent === correctAnswerDecoded) {
      btn.style.backgroundColor = '#4caf50';
      btn.style.color = '#ffffff';
    }
    btn.disabled = true;
  });
}

// Decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Load first question and set up next button
displayQuestion();
nextButton.addEventListener('click', displayQuestion);

// Initialize the score display
scoreElement.textContent = `Score: ${score}`;


// In your displayQuestion function, after creating buttons:
shuffledAnswers.forEach(answer => {
  const button = document.createElement('button');
  button.textContent = decodeHTML(answer);
  // Add these lines for responsive buttons:
  button.style.whiteSpace = 'normal'; // Allow text wrapping
  button.style.wordBreak = 'break-word'; // Break long words
  button.style.height = 'auto'; // Auto height
  button.style.padding = '10px 15px'; // Adequate padding
  button.style.minHeight = '7vh'; // Minimum height
  // Rest of your button code...
});

// Update your existing JavaScript with these changes

// Display question and answers
async function displayQuestion() {
  const questionData = await fetchQuestion();
  const decodedQuestion = decodeHTML(questionData.question);
  
  // Set question content
  questionElement.innerHTML = decodedQuestion;
  
  // Auto-resize the question box based on content
  questionElement.style.height = 'auto'; // Reset height
  questionElement.style.minHeight = '25vh'; // Set minimum height
  questionElement.style.height = questionElement.scrollHeight + 'px'; // Set to content height
  
  const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer];
  const shuffledAnswers = shuffleArray(allAnswers);

  answersContainer.innerHTML = '';
  shuffledAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = decodeHTML(answer);
    button.addEventListener('click', () => checkAnswer(button, questionData.correct_answer));
    answersContainer.appendChild(button);
  });
}