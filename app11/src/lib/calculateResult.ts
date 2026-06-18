import { resultTypes } from "@/data/resultTypes";
import type { Question, RankedResult, ResultTypeId, ScoreMap } from "@/types/check";

export function calculateScores(selectedQuestionIds: string[], questions: Question[]): Record<ResultTypeId, number> {
  const selectedIds = new Set(selectedQuestionIds);
  const scores = resultTypes.reduce(
    (acc, type) => {
      acc[type.id] = 0;
      return acc;
    },
    {} as Record<ResultTypeId, number>
  );

  questions.forEach((question) => {
    if (!selectedIds.has(question.id)) {
      return;
    }

    Object.entries(question.scores).forEach(([typeId, point]) => {
      scores[typeId as ResultTypeId] += point ?? 0;
    });
  });

  return scores;
}

export function getTopResults(selectedQuestionIds: string[], questions: Question[], limit = 3): RankedResult[] {
  const scores = calculateScores(selectedQuestionIds, questions);

  return resultTypes
    .map((type) => ({
      ...type,
      score: scores[type.id] ?? 0
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ja"))
    .slice(0, limit)
    .map((type, index) => ({
      ...type,
      rank: index + 1
    }));
}

export function sumScoreMap(scoreMap: ScoreMap): number {
  return Object.values(scoreMap).reduce((total, score) => total + (score ?? 0), 0);
}
