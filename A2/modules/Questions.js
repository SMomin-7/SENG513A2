export class Question {
  constructor(text, choices, correctAnswer) {
    if (!text || choices.length === 0) {
      throw new Error("Invalid question format");
    } //If no text or choices then we throw and invalid question error
    this.text = text;
    this.choices = choices;
    this.correctAnswer = correctAnswer; //OTherwsie use the this keyword in the constructor to assign the text, choices, and corr ans
  }

  isCorrectAnswer(answer) {
    return answer === this.correctAnswer;
  }//Utilize this keyword again to check if an ans is correct
}
