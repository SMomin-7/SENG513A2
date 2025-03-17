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

    usernameContainer.style.display = "none"; 
    quizContainer.style.display = "block"; 

    quizUI.renderQuestion();
  });

  restartQuizButton.addEventListener("click", async () => {
    if (confirm("Are you sure you want to restart?")) {
      // Reset UI
      usernameContainer.style.display = "block";
      quizContainer.style.display = "none";
      quizComplete.style.display = "none";
      usernameInput.value = "";             // Clear username input

      // Fetch new questions and reset the quiz
      const newQuestions = await fetchQuestions();
      if (newQuestions.length === 0) {
        alert("Failed to reload questions. Please try again.");
        return;
      }

      // Reset the quiz instance completely
      window.quiz = new Quiz(newQuestions);
      window.quizUI = new QuizUI(window.quiz, new User("Guest"));

      // Clear previous event listener and reapply
      restartQuizButton.removeEventListener("click", restartQuiz);
      restartQuizButton.addEventListener("click", restartQuiz);

      window.quizUI.renderQuestion();
    }
  });
}

initializeQuiz();
