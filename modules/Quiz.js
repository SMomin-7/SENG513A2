export class Quiz {
  constructor(questions) {
    this.questions = questions.sort((a, b) => a.difficulty - b.difficulty); // Sort questions by difficulty
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.askedQuestions = new Set(); // Track which questions have been asked
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  checkAnswer(answer) {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion.isCorrectAnswer(answer)) {
      this.score++;
    }
  }

  moveToNextQuestion(isCorrect) {
    // Mark the current question as asked
    this.askedQuestions.add(this.currentQuestionIndex);

    // Find the next question based on difficulty
    if (isCorrect) {
      // Move to a harder question
      this.currentQuestionIndex = this.findNextQuestion(this.currentQuestionIndex + 1);
    } else {
      // Move to an easier question
      this.currentQuestionIndex = this.findNextQuestion(this.currentQuestionIndex - 1);
    }
  }

  findNextQuestion(startIndex) {
    // Find the next unasked question within the valid range
    for (let i = startIndex; i >= 0 && i < this.questions.length; i += (startIndex < this.currentQuestionIndex ? -1 : 1)) {
      if (!this.askedQuestions.has(i)) {
        return i;
      }
    }

    // If no unasked question is found in the desired direction, find the closest unasked question
    for (let i = 0; i < this.questions.length; i++) {
      if (!this.askedQuestions.has(i)) {
        return i;
      }
    }

    // If all questions have been asked, return -1 (quiz is over)
    return -1;
  }

  isQuizOver() {
    return this.askedQuestions.size >= this.questions.length || this.currentQuestionIndex === -1;
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.askedQuestions.clear();
  }
}