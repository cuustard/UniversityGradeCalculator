import { create } from 'zustand';
import { createClient } from './supabase/client';
import { AppState, AssessmentRow, Module, ModuleRow } from './types';

function uid() {
  return crypto.randomUUID();
}

// Single memoized browser Supabase client.
let _sb: ReturnType<typeof createClient> | null = null;
function sb() {
  return (_sb ??= createClient());
}

// Cached id of the signed-in user (set during load(); needed for inserts under RLS).
let userId: string | null = null;

function rowsToModules(modRows: ModuleRow[], assRows: AssessmentRow[]): Module[] {
  return modRows.map((m) => ({
    id: m.id,
    name: m.name,
    credits: m.credits,
    assessments: assRows
      .filter((a) => a.module_id === m.id)
      .map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        weight: Number(a.weight),
        grade:
          a.grade === null ? null : a.grade_type === 'pct' ? Number(a.grade) : a.grade,
        gradeType: a.grade_type,
      })),
  }));
}

/**
 * Run an optimistic write-through to Supabase. Local state has already been updated;
 * if the cloud write fails we log and reload from the server to resync.
 */
async function write(run: (client: ReturnType<typeof createClient>, uid: string) => Promise<void>) {
  const client = sb();
  if (!userId) {
    const { data } = await client.auth.getUser();
    userId = data.user?.id ?? null;
  }
  if (!userId) return;
  try {
    await run(client, userId);
  } catch (e) {
    console.error('[gradetrack] cloud write failed — reloading from server', e);
    await useStore.getState().load();
  }
}

export const useStore = create<AppState>()((set) => ({
  modules: [],
  loaded: false,

  load: async () => {
    const client = sb();
    const { data: userData } = await client.auth.getUser();
    userId = userData.user?.id ?? null;
    if (!userId) {
      set({ modules: [], loaded: true });
      return;
    }
    const [{ data: modRows, error: modErr }, { data: assRows, error: assErr }] =
      await Promise.all([
        client.from('modules').select('*').order('created_at', { ascending: true }),
        client.from('assessments').select('*').order('created_at', { ascending: true }),
      ]);
    if (modErr || assErr) {
      console.error('[gradetrack] load failed', modErr, assErr);
      set({ loaded: true });
      return;
    }
    set({
      modules: rowsToModules((modRows ?? []) as ModuleRow[], (assRows ?? []) as AssessmentRow[]),
      loaded: true,
    });
  },

  reset: () => {
    userId = null;
    set({ modules: [], loaded: false });
  },

  addModule: (name, credits) => {
    const id = uid();
    set((s) => ({ modules: [...s.modules, { id, name, credits, assessments: [] }] }));
    void write(async (client, uidd) => {
      const { error } = await client.from('modules').insert({ id, user_id: uidd, name, credits });
      if (error) throw error;
    });
  },

  removeModule: (id) => {
    set((s) => ({ modules: s.modules.filter((m) => m.id !== id) }));
    void write(async (client) => {
      // assessments cascade-delete via FK
      const { error } = await client.from('modules').delete().eq('id', id);
      if (error) throw error;
    });
  },

  addAssessment: (moduleId, assessment) => {
    const id = uid();
    set((s) => ({
      modules: s.modules.map((m) =>
        m.id === moduleId
          ? { ...m, assessments: [...m.assessments, { ...assessment, id }] }
          : m
      ),
    }));
    void write(async (client, uidd) => {
      const { error } = await client.from('assessments').insert({
        id,
        module_id: moduleId,
        user_id: uidd,
        name: assessment.name,
        type: assessment.type,
        weight: assessment.weight,
        grade: assessment.grade === null ? null : String(assessment.grade),
        grade_type: assessment.gradeType,
      });
      if (error) throw error;
    });
  },

  removeAssessment: (moduleId, assessmentId) => {
    set((s) => ({
      modules: s.modules.map((m) =>
        m.id === moduleId
          ? { ...m, assessments: m.assessments.filter((a) => a.id !== assessmentId) }
          : m
      ),
    }));
    void write(async (client) => {
      const { error } = await client.from('assessments').delete().eq('id', assessmentId);
      if (error) throw error;
    });
  },

  updateAssessmentGrade: (moduleId, assessmentId, grade, gradeType) => {
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
    }));
    void write(async (client) => {
      const { error } = await client
        .from('assessments')
        .update({ grade: String(grade), grade_type: gradeType })
        .eq('id', assessmentId);
      if (error) throw error;
    });
  },
}));
