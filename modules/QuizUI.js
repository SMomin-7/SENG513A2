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
      this.finalScoreDisplay = document.getElementById("final-score"); //Constructor, make the UI elements accessible to the backend using this method
  
      //Bind context of "this" for event listeners
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleNext = this.handleNext.bind(this);
  
      this.submitButton.addEventListener("click", this.handleSubmit);
      this.nextButton.addEventListener("click", this.handleNext);//Add event listeners
    }
  
    //Quiz creator function
    *createQuestionFlow() {
      while (!this.quiz.isQuizOver()) {
        this.renderQuestion();
        yield; //yield will wait for user input
      }
      this.showFinalResults();
    }
  
    handleSubmit() {
      const selectedAnswer = document.querySelector('input[name="answer"]:checked')?.value;
      if (selectedAnswer) {
        const currentQuestion = this.quiz.getCurrentQuestion();
        const isCorrect = currentQuestion.isCorrectAnswer(selectedAnswer);
  
        //Correct and incorrect answers can be highlighted
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
  
        //If our ans was corect, update the score
        this.quiz.checkAnswer(selectedAnswer);
        this.scoreDisplay.textContent = this.quiz.score;
  
        //Disable the submit button once our score is updated
        this.submitButton.style.display = "none";
  
        //We can check if this was the last question of the quiz, and take the next steps
        const isLastQuestion = this.quiz.currentQuestionIndex === this.quiz.questions.length - 1;
  
        if (isLastQuestion) {
          setTimeout(() => {
            this.showFinalResults();
          }, 1000);
        } else {
          //findal results shown and next button displayed
          this.nextButton.style.display = "inline-block";
        }
      }
    }
  
    handleNext() {
      if (!this.quiz.isQuizOver()) {
        //Hide the next button adn show the submit button
        this.nextButton.style.display = "none";
        this.submitButton.style.display = "inline-block";
  
        //Go to next q
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
  
      //Score reset after new quiz
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
  

      this.questionsLeftDisplay.textContent = this.quiz.questions.length - this.quiz.askedQuestions.size;
  
      //This allows us to reenable the submit button
      this.submitButton.disabled = false;
  
      const labels = document.querySelectorAll("#choices li label");
      labels.forEach((label) => {
        label.classList.remove("correct", "wrong");
      });
  
      //Hiding next question button once quiz ends
      if (this.quiz.isQuizOver()) {
        this.nextButton.style.display = "none";
      }
    }
  
    //allows us to reset ui if needed
    resetUI() {
      //Clear q text and all choices once reset
      this.questionText.textContent = "";
      this.choicesList.innerHTML = "";
  

      this.submitButton.style.display = "inline-block";
      this.nextButton.style.display = "none"; //Makes buttons, scores, and tests visible
      this.scoreDisplay.textContent = "0";
      this.questionsLeftDisplay.textContent = this.quiz.questions.length;

      this.quizContainer.style.display = "block";
      this.quizComplete.style.display = "none";//Quiz complete section will hide behind quiz container, and clear selected answers
      const selectedAnswer = document.querySelector('input[name="answer"]:checked');
      if (selectedAnswer) {
        selectedAnswer.checked = false;
      }
    }
  }