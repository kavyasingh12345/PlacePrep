// Server-side mock test scoring
export const calculateScore = (questions, userAnswers, negativeMarking, negativeValue) => {
    let correct = 0, wrong = 0, skipped = 0;
    const answers = [];
  
    questions.forEach((q, i) => {
      const selected = userAnswers[i] ?? -1;
      const isCorrect = selected === q.correctIndex;
      const isSkipped = selected === -1;
  
      if (isSkipped) {
        skipped++;
      } else if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }
  
      answers.push({ questionId: q._id, selected, correct: isCorrect });
    });
  
    const rawScore = correct - (negativeMarking ? wrong * negativeValue : 0);
    const score = Math.max(0, rawScore);
    const maxScore = questions.length;
    const percentage = Math.round((score / maxScore) * 100);
  
    return { score, maxScore, percentage, correct, wrong, skipped, answers };
  };
  
  export const calculateSectionScores = (sections, userAnswers) => {
    let offset = 0;
    return sections.map(section => {
      const sectionAnswers = userAnswers.slice(offset, offset + section.questionCount);
      const correct = section.questions.filter((q, i) =>
        sectionAnswers[i] === q.correctIndex
      ).length;
      offset += section.questionCount;
      return { section: section.name, score: correct, total: section.questionCount };
    });
  };