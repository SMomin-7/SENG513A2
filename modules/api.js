import { Question } from "./Questions.js";

// Function to decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export async function fetchQuestions() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    return data.results.map((q, index) => {
      let choices = [...q.incorrect_answers, q.correct_answer]
        .map(decodeHTML) // Decode each choice
        .sort(() => Math.random() - 0.5); // Randomize choices

      // Assign a difficulty level based on the question index (for demonstration purposes)
      const difficulty = (index % 3) + 1; // 1 = easy, 2 = medium, 3 = hard

      return new Question(
        decodeHTML(q.question), // Decode question text
        choices,
        decodeHTML(q.correct_answer), // Decode correct answer
        difficulty // Add difficulty level
      );
    });

  } catch (error) {
    console.error("Failed to fetch questions:", error.message);
    return [];
  }
}