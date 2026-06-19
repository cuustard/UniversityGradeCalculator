export type AssessmentType = 'coursework' | 'exam';
export type GradeType = 'letter' | 'pct';

export interface Assessment {
  id: string;
  name: string;
  type: AssessmentType;
  weight: number; // % within module
  grade: string | number | null; // letter string or % number
  gradeType: GradeType | null;
}

export interface Module {
  id: string;
  name: string;
  credits: number;
  assessments: Assessment[];
}

export interface AppState {
  modules: Module[];
  loaded: boolean;
  load: () => Promise<void>;
  reset: () => void;
  addModule: (name: string, credits: number) => void;
  removeModule: (id: string) => void;
  addAssessment: (moduleId: string, assessment: Omit<Assessment, 'id'>) => void;
  removeAssessment: (moduleId: string, assessmentId: string) => void;
  updateAssessmentGrade: (moduleId: string, assessmentId: string, grade: string | number, gradeType: GradeType) => void;
}

// ── Database row shapes (Supabase) ──────────────────────────────────────────
export interface ModuleRow {
  id: string;
  user_id: string;
  name: string;
  credits: number;
  created_at: string;
}

export interface AssessmentRow {
  id: string;
  module_id: string;
  user_id: string;
  name: string;
  type: AssessmentType;
  weight: number;
  grade: string | null; // raw text; parse to number when grade_type === 'pct'
  grade_type: GradeType | null;
  created_at: string;
}

export interface ClassificationBoundary {
  label: string;
  short: string;
  cls: string;
  agg: number;
  color: string;
}

export interface ModuleAggResult {
  partialAgg: number;
  weightDone: number;
  effectiveAgg: number;
}

export interface RequiredGradeResult {
  pct: number | null;
  agg: number;
  status: 'achieved' | 'impossible' | 'tight' | 'achievable';
}
