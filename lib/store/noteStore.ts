"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewNote } from "@/types/note";

type NoteDraftStore = {
  draft: NewNote;
  setDraft: (note: Partial<NewNote>) => void;
  clearDraft: () => void;
};

const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore =
  create<NoteDraftStore>()(
    persist(
      (set) => ({
        draft: initialDraft,

        setDraft: (note) =>
          set((state) => ({
            draft: { ...state.draft, ...note },
          })),

        clearDraft: () =>
          set({
            draft: initialDraft,
          }),
      }),
      {
        name: "note-draft-storage",
      },
    ),
  );
