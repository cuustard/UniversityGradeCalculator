import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from './types';

function uid() {
  return crypto.randomUUID();
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      modules: [],

      addModule: (name, credits) =>
        set((s) => ({
          modules: [...s.modules, { id: uid(), name, credits, assessments: [] }],
        })),

      removeModule: (id) =>
        set((s) => ({ modules: s.modules.filter((m) => m.id !== id) })),

      addAssessment: (moduleId, assessment) =>
        set((s) => ({
          modules: s.modules.map((m) =>
            m.id === moduleId
              ? { ...m, assessments: [...m.assessments, { ...assessment, id: uid() }] }
              : m
          ),
        })),

      removeAssessment: (moduleId, assessmentId) =>
        set((s) => ({
          modules: s.modules.map((m) =>
            m.id === moduleId
              ? { ...m, assessments: m.assessments.filter((a) => a.id !== assessmentId) }
              : m
          ),
        })),

      updateAssessmentGrade: (moduleId, assessmentId, grade, gradeType) =>
        set((s) => ({
          modules: s.modules.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  assessments: m.assessments.map((a) =>
                    a.id === assessmentId ? { ...a, grade, gradeType } : a
                  ),
                }
              : m
          ),
        })),
    }),
    { name: 'gradetrack-v3', version: 1 }
  )
);
