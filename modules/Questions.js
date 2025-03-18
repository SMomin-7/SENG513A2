export class Question {
  constructor(text, choices, correctAnswer, difficulty) {
    if (!text || choices.length === 0) {
      throw new Error("Invalid question format");//Error thrown if text is too short
    }
    this.text = text;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
    this.difficulty = difficulty;
    //Quiz constructor, allows us to set text, choices, correct ans, and difficulty
  }

  isCorrectAnswer(answer) {
    return answer === this.correctAnswer;
  }//Checking if ans is correct
}