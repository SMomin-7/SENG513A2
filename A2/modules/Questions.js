export class Question {
  constructor(text, choices, correctAnswer) {
    if (!text || choices.length === 0) {
      throw new Error("Invalid question format");
    }
    this.text = text;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
  }

  isCorrectAnswer(answer) {
    return answer === this.correctAnswer;
  }
}
