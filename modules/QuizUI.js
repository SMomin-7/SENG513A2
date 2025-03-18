export class QuizUI {
    constructor(quiz, user) {
      this.quiz = quiz;
      this.user = user;
      this.questionText = document.getElementById("question-text");
      this.choicesList = document.getElementById("choices");
      this.submitButton = document.getElementById("submit-answer");
      this.nextButton = document.getElementById("next-question");
      this.scoreDisplay = document.getElementById("score");
      this.questionsLeftDisplay = document.getElementById("questions-left");
      this.quizContainer = document.getElementById("quiz-container");
      this.quizComplete = document.getElementById("quiz-complete");
      this.finalScoreDisplay = document.getElementById("final-score");
  
      // Bind the context of `this` for event listeners
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleNext = this.handleNext.bind(this);
  
      this.submitButton.addEventListener("click", this.handleSubmit);
      this.nextButton.addEventListener("click", this.handleNext);
    }
  
    // Generator function to manage quiz flow
    *createQuestionFlow() {
      while (!this.quiz.isQuizOver()) {
        this.renderQuestion();
        yield; // Wait for user input
      }
      this.showFinalResults();
    }
  
    handleSubmit() {
      const selectedAnswer = document.querySelector('input[name="answer"]:checked')?.value;
      if (selectedAnswer) {
        const currentQuestion = this.quiz.getCurrentQuestion();
        const isCorrect = currentQuestion.isCorrectAnswer(selectedAnswer);
  
        // Highlight correct/wrong answers
        const choices = document.querySelectorAll('input[name="answer"]');
        choices.forEach((choice) => {
          const label = choice.parentElement;
          label.classList.remove("correct", "wrong");
        });
  
        choices.forEach((choice) => {
          const label = choice.parentElement;
          if (choice.value === currentQuestion.correctAnswer) {
            label.classList.add("correct");
          } else if (choice.value === selectedAnswer) {
            label.classList.add("wrong");
          }
          choice.disabled = true;
        });
  
        // Update score if correct
        this.quiz.checkAnswer(selectedAnswer);
        this.scoreDisplay.textContent = this.quiz.score;
  
        // Hide the "Submit" button
        this.submitButton.style.display = "none";
  
        // Check if this is the last question
        const isLastQuestion = this.quiz.currentQuestionIndex === this.quiz.questions.length - 1;
  
        if (isLastQuestion) {
          // Automatically show final results after 1 second
          setTimeout(() => {
            this.showFinalResults();
          }, 1000);
        } else {
          // Show the "Next Question" button
          this.nextButton.style.display = "inline-block";
        }
      }
    }
  
    handleNext() {
      if (!this.quiz.isQuizOver()) {
        // Hide the "Next Question" button and show the "Submit" button
        this.nextButton.style.display = "none";
        this.submitButton.style.display = "inline-block";
  
        // Move to the next question
        this.quiz.moveToNextQuestion();
        this.renderQuestion();
      } else {
        this.showFinalResults();
      }
    }
  
    showFinalResults() {
      this.quizContainer.style.display = "none";
      this.quizComplete.style.display = "block";
      this.finalScoreDisplay.textContent = this.quiz.score;
  
      // Reset score display for next quiz attempt
      this.scoreDisplay.textContent = "0";
  
      this.quiz.restartQuiz();
      this.user.addScore(this.quiz.score);
    }
  
    renderQuestion() {
      const currentQuestion = this.quiz.getCurrentQuestion();
      this.questionText.textContent = currentQuestion.text;
  
      this.choicesList.innerHTML = currentQuestion.choices
        .map(
          (choice, index) => `
            <li>
              <input type="radio" id="choice-${index}" name="answer" value="${choice}">
              <label for="choice-${index}">${choice}</label>
            </li>
          `
        )
        .join("");
  
      // Update questions left counter
      this.questionsLeftDisplay.textContent = this.quiz.questions.length - this.quiz.askedQuestions.size;
  
      // Enable submit button and remove old styles
      this.submitButton.disabled = false;
  
      const labels = document.querySelectorAll("#choices li label");
      labels.forEach((label) => {
        label.classList.remove("correct", "wrong");
      });
  
      // Hide the "Next Question" button for the last question
      if (this.quiz.isQuizOver()) {
        this.nextButton.style.display = "none";
      }
    }
  
    // Reset UI for a new quiz
    resetUI() {
      console.log("Resetting UI..."); // Debugging
  
      // Clear the question text and choices
      this.questionText.textContent = "";
      this.choicesList.innerHTML = "";
  
      // Reset button visibility
      this.submitButton.style.display = "inline-block";
      this.nextButton.style.display = "none";
  
      // Reset score and questions left display
      this.scoreDisplay.textContent = "0";
      this.questionsLeftDisplay.textContent = this.quiz.questions.length;
  
      // Show the quiz container and hide the quiz complete section
      this.quizContainer.style.display = "block";
      this.quizComplete.style.display = "none";
  
      // Clear any selected answer
      const selectedAnswer = document.querySelector('input[name="answer"]:checked');
      if (selectedAnswer) {
        selectedAnswer.checked = false;
      }
  
      console.log("UI reset complete."); // Debugging
    }
  }