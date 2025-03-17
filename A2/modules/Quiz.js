export class Quiz {
  constructor(questions) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answers = []; // Store selected answers
    this.startTime = new Date(); // Track when quiz starts
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  checkAnswer(answer) {
    const currentQuestion = this.getCurrentQuestion();
    this.answers.push({ 
      question: currentQuestion.text, 
      selected: answer, 
      correct: currentQuestion.isCorrectAnswer(answer)
    });

    if (currentQuestion.isCorrectAnswer(answer)) {
      this.score++;
    }
  }

  moveToNextQuestion() {
    // ✅ Fix: Allow last question to be answered before stopping
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  isQuizOver() {
    // ✅ Fix: Return true **only** after the last question is submitted
    return this.currentQuestionIndex >= this.questions.length;
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answers = [];
    this.startTime = new Date();
  }
}
