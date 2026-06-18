export type BodyPartId =
  | "neck"
  | "shoulder"
  | "back"
  | "waist"
  | "hip"
  | "knee"
  | "ankle"
  | "sole"
  | "toe"
  | "posture";

export type ResultTypeId =
  | "foot-support"
  | "desk-posture"
  | "core-stability"
  | "hip-lower-link"
  | "rounded-shoulder-forward-neck"
  | "exercise-form"
  | "lifestyle";

export type ScoreMap = Partial<Record<ResultTypeId, number>>;

export type Question = {
  id: string;
  label: string;
  bodyParts: BodyPartId[];
  scores: ScoreMap;
};

export type ResultType = {
  id: ResultTypeId;
  title: string;
  shortLabel: string;
  description: string;
  reviewCandidates: string[];
  selfCareExamples: string[];
  consultationGuide: string;
};

export type RankedResult = ResultType & {
  score: number;
  rank: number;
};
