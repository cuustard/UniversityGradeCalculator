import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Assessment, GradeType, Module } from './types';

function uid() {
  return Math.random().toString(36).slice(2, 10);
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
    { name: 'gradetrack-v3' }
  )
);
