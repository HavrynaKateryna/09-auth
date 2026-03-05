// types/note.ts
import { AxiosError } from "axios";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export type NoteTag =
  | "Todo"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping";

export type ApiError = AxiosError<{
  error: string;
}>;

// Тип для useQuery fetchNotes
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
