export class Question {
  constructor(text, choices, correctAnswer, difficulty) {
    if (!text || choices.length === 0) {
      throw new Error("Invalid question format");
    }
    this.text = text;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
    this.difficulty = difficulty; // Add difficulty level (e.g., 1 = easy, 2 = medium, 3 = hard)
  }

  isCorrectAnswer(answer) {
    return answer === this.correctAnswer;
  }
}