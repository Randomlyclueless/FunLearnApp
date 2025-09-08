export class PoemAnalyzer {
  static analyzeDifficulty(text) {
    const words = text.split(/\s+/);
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const complexWords = words.filter((word) => word.length > 6).length;
    const complexityRatio = complexWords / words.length;

    if (avgWordLength < 4 && complexityRatio < 0.1) return "Easy";
    if (avgWordLength < 5.5 && complexityRatio < 0.2) return "Medium";
    return "Hard";
  }

  static extractSyllables(word) {
    const vowels = "aeiouyAEIOUY";
    let count = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }

    return Math.max(1, count);
  }

  static highlightRhymes(lines) {
    const rhymeGroups = [];
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

    lines.forEach((line, index) => {
      const words = line.trim().split(/\s+/);
      if (words.length === 0) return;

      const lastWord = words[words.length - 1]
        .toLowerCase()
        .replace(/[.,!?;]$/, "");

      if (lastWord.length < 2) return;

      const rhymeEnding = lastWord.slice(-2);
      const rhymeGroup = rhymeGroups.find((group) =>
        group.endings.includes(rhymeEnding)
      );

      if (rhymeGroup) {
        rhymeGroup.lines.push(index);
        rhymeGroup.endings.push(rhymeEnding);
      } else if (lastWord.length >= 2) {
        rhymeGroups.push({
          lines: [index],
          endings: [rhymeEnding],
          color: colors[rhymeGroups.length % colors.length],
        });
      }
    });

    return rhymeGroups.filter((group) => group.lines.length > 1);
  }

  static generateComprehensionQuestions(poem) {
    const questions = [
      {
        question: `What is the main theme of "${poem.title}"?`,
        options: [poem.theme, "Adventure", "Mystery", "Comedy"],
        correct: 0,
        type: "theme",
      },
      {
        question: "How many lines does this poem have?",
        options: [
          poem.content
            .split("\n")
            .filter((l) => l.trim())
            .length.toString(),
          "10",
          "8",
          "12",
        ],
        correct: 0,
        type: "structure",
      },
    ];
    return questions;
  }
}
