export class User {
  constructor(username) {
    if (!username.trim()) {
      throw new Error("Username cannot be empty");
    }
    this.username = username;
    this.scoreHistory = JSON.parse(localStorage.getItem(username)) || [];
  }

  addScore(score) {
    this.scoreHistory.push(score);
    localStorage.setItem(this.username, JSON.stringify(this.scoreHistory));
  }

  getScoreHistory() {
    return this.scoreHistory;
  }
}
