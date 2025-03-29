const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score'); // Assuming you have an element to display the score

let score = 0; // Initialize the score

// Fetch question from Open Trivia Database API
async function fetchQuestion() {
  try {
    const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple'; // Fetches 1 multiple-choice question
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
    selectedButton.style.backgroundColor = '#4caf50'; // Green
    selectedButton.style.color = '#ffffff'; // White text
    alert('You are correct!');
    score += 5; // Add 5 points to the score
  } else {
    // Incorrect answer
    selectedButton.style.backgroundColor = '#f44336'; // Red
    alert(`You missed that! The correct answer is "${correctAnswerDecoded}".`);
    score -= 5; // Deduct 5 points from the score
  }

  // Update the score display
  scoreElement.textContent = `Score: ${score}`;

  // Highlight correct answer and disable all buttons
  buttons.forEach(btn => {
    if (btn.textContent === correctAnswerDecoded) {
      btn.style.backgroundColor = '#4caf50'; // Green
      btn.style.color = '#ffffff'; // White text
    }
    btn.disabled = true;
  });
}

// Decode HTML entities (like &quot; or &amp;)
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Load first question and set up next button
displayQuestion();
nextButton.addEventListener('click', () => {
  displayQuestion();
  // Optionally, you can reset the score or add other logic here
});

// Initialize the score display
scoreElement.textContent = `Score: ${score}`;