import axios from "./api";
import {
  Note,
  FetchNotesResponse,
} from "@/types/note";

export interface AuthData {
  email: string;
  password: string;
}

// ───── Авторизация ─────
export const register = async (
  data: AuthData,
) => {
  const res = await axios.post(
    "/auth/register",
    data,
    { withCredentials: true },
  );
  return res.data;
};

export const login = async (data: AuthData) => {
  const res = await axios.post(
    "/auth/login",
    data,
    { withCredentials: true },
  );
  return res.data;
};

export const logout = async () => {
  await axios.post(
    "/auth/logout",
    {},
    { withCredentials: true },
  );
};

// ───── Заметки ─────

// Теперь fetchNotes возвращает объект с notes и totalPages
export const fetchNotes = async (
  query: string,
  page: number,
  tag: string,
): Promise<FetchNotesResponse> => {
  const res = await axios.get("/notes", {
    params: { query, page, tag },
    withCredentials: true,
  });

  return {
    notes: res.data.notes, // массив заметок
    totalPages: res.data.totalPages || 1, // количество страниц
  };
};

export const fetchNoteById = async (
  id: string,
): Promise<Note> => {
  const res = await axios.get(`/notes/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}) => {
  const res = await axios.post("/notes", note, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await axios.delete(`/notes/${id}`, {
    withCredentials: true,
  });
  return res.data;
};
