export class QuizUI {
    constructor(quiz, user) {
        this.quiz = quiz;
        this.user = user;
        this.questionText = document.getElementById("question-text");
        this.choicesList = document.getElementById("choices");
        this.submitButton = document.getElementById("submit-answer");
        this.scoreDisplay = document.getElementById("score");
        this.questionsLeftDisplay = document.getElementById("questions-left");
        this.quizContainer = document.getElementById("quiz-container");
        this.quizComplete = document.getElementById("quiz-complete");
        this.finalScoreDisplay = document.getElementById("final-score");

        this.submitButton.addEventListener("click", this.handleSubmit.bind(this));

        this.submitButton.disabled = false;
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
                label.classList.remove("correct", "wrong"); // Clear previous styles
            });

            choices.forEach((choice) => {
                const label = choice.parentElement;
                if (choice.value === currentQuestion.correctAnswer) {
                    label.classList.add("correct");     // Green highlight for correct
                } else if (choice.value === selectedAnswer) {
                    label.classList.add("wrong");       // Red highlight for wrong
                }
                choice.disabled = true;               // Disable all choices
            }) 

            // Update score if correct
            this.quiz.checkAnswer(selectedAnswer);
            this.scoreDisplay.textContent = this.quiz.score;

            // Disable submit button
            this.submitButton.disabled = true;

            // If it's the last question, show results instead of moving to next
            if (this.quiz.currentQuestionIndex === this.quiz.questions.length - 1) {
                setTimeout(() => {
                    this.showFinalResults();
                }, 2000);
            } else {
                // Move to the next question after 2 seconds
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
        }
    }

    // New function to handle quiz completion
    showFinalResults() {
        this.quizContainer.style.display = "none";
        this.quizComplete.style.display = "block";
        this.finalScoreDisplay.textContent = this.quiz.score;

        // Reset score display for next quiz attempt
        this.scoreDisplay.textContent = "0"

        this.quiz.restartQuiz();              // Fully reset the stored quiz state    
        this.user.addScore(this.quiz.score);  // Save score history for user
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

        this.questionsLeftDisplay.textContent = this.quiz.questions.length - this.quiz.currentQuestionIndex;

        // Enable submit button and remove old styles
        this.submitButton.disabled = false;

        const labels = document.querySelectorAll("#choices li label");
        labels.forEach((label) => {
            label.classList.remove("correct", "wrong");
        });
    }
  
}
  