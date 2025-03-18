import { fetchQuestions } from "./modules/api.js";
import { Quiz } from "./modules/Quiz.js";
import { QuizUI } from "./modules/QuizUI.js";
import { User } from "./modules/User.js";

async function initializeQuiz() {
  const usernameContainer = document.getElementById("username-container");
  const usernameInput = document.getElementById("username");
  const startQuizButton = document.getElementById("start-quiz");
  const quizContainer = document.getElementById("quiz-container");
  const usernameDisplay = document.getElementById("username-display");
  const quizComplete = document.getElementById("quiz-complete");
  const restartQuizButton = document.getElementById("restart-quiz");

  startQuizButton.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    if (!username) {
      alert("Please enter a username!");
      return;
    }

    const user = new User(username);
    usernameDisplay.textContent = `LET'S START, ${user.username}!`;

    const questions = await fetchQuestions();
    if (questions.length === 0) {
      alert("Failed to load questions. Please try again later.");
      return;
    }

    const quiz = new Quiz(questions);
    const quizUI = new QuizUI(quiz, user);

    // Reset the UI for a new quiz
    quizUI.resetUI();

    usernameContainer.style.display = "none";
    quizContainer.style.display = "block";

    // Start the generator function for quiz flow
    const questionFlow = quizUI.createQuestionFlow();
    questionFlow.next(); // Start the flow
  });

  restartQuizButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to restart?")) {
      // Refresh the page to start a new quiz
      location.reload();
    }
  });
}

initializeQuiz();