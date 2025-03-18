export class QuizUI {
  constructor(quiz, user) {//Constructor method to setup variables used throughout the backend of the Quiz UI
    this.quiz = quiz;
    this.user = user;
    this.questionText = document.getElementById("question-text"); //Displays question text
    this.choicesList = document.getElementById("choices");//Will display choices
    this.submitButton = document.getElementById("submit-answer"); //Button to submit answer
    this.scoreDisplay = document.getElementById("score"); //Score display feature
    this.questionsLeftDisplay = document.getElementById("questions-left");//The number of questions remaining
    this.quizContainer = document.getElementById("quiz-container"); 
    this.quizComplete = document.getElementById("quiz-complete");
    this.finalScoreDisplay = document.getElementById("final-score");

    this.submitButton.addEventListener("click", this.handleSubmit.bind(this));//Adding an event listener to the submit button

    this.submitButton.disabled = false;
  }

  handleSubmit() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked')?.value;
    if (selectedAnswer) {
      const currentQuestion = this.quiz.getCurrentQuestion();
      const isCorrect = currentQuestion.isCorrectAnswer(selectedAnswer);//Figure out if the answer is correct or not
  
    
      const choices = document.querySelectorAll('input[name="answer"]');
      choices.forEach((choice) => {
        const label = choice.parentElement;
        label.classList.remove("correct", "wrong"); //Do this to remove prfevious styles
      });

      choices.forEach((choice) => {
        const label = choice.parentElement;
        if (choice.value === currentQuestion.correctAnswer) {
          label.classList.add("correct"); //This applies a green highlight to the correct anwser
        } else if (choice.value === selectedAnswer) {
          label.classList.add("wrong"); //This provides a red highlight to the wrong answer
        }
        choice.disabled = true; //Disables choices to prevent multiple clicks
      }) 
  
      //We can then check the answer and update the score
      this.quiz.checkAnswer(selectedAnswer);
      this.scoreDisplay.textContent = this.quiz.score;
  
      //Disabling the sbumit button to prevent double submissions
      this.submitButton.disabled = true;
  
      //This line checks the questions. If it is the final question then we show the final results
      if (this.quiz.currentQuestionIndex === this.quiz.questions.length - 1) {
        setTimeout(() => {
          this.showFinalResults();
        }, 2000);
      } else {
        //Otherwise move to the next question
        setTimeout(() => {
          this.handleNext();
        }, 2000);
      }
    }
  }
  
  handleNext() {
    if (!this.quiz.isQuizOver()) {
      this.quiz.moveToNextQuestion();
      this.renderQuestion();
    } else {
      this.showFinalResults();
    }//Go to the next question if this function is called
  }
  
  //this function will print out the final results
  showFinalResults() {
    this.quizContainer.style.display = "none";
    this.quizComplete.style.display = "block";
    this.finalScoreDisplay.textContent = this.quiz.score;

    //reset the score
    this.scoreDisplay.textContent = "0"

    this.quiz.restartQuiz(); //Restart the quiz and save the score history    
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
      )//Renders the next question in the html (Helper function)
      .join("");

    this.questionsLeftDisplay.textContent = this.quiz.questions.length - this.quiz.currentQuestionIndex;

    //Remove the previous styles and disable the submit button
    this.submitButton.disabled = false;

    const labels = document.querySelectorAll("#choices li label");
    labels.forEach((label) => {
      label.classList.remove("correct", "wrong");
    });
}

}
