import axios from "./api";
import { Note } from "@/types/note";

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
export const fetchNotes = async (
  params?: Record<string, any>,
) => {
  const res = await axios.get<Note[]>("/notes", {
    params,
    withCredentials: true,
  });
  return res.data;
};

export const fetchNoteById = async (
  id: string,
) => {
  const res = await axios.get<Note>(
    `/notes/${id}`,
    { withCredentials: true },
  );
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
  const res = await axios.delete<Note>(
    `/notes/${id}`,
    { withCredentials: true },
  );
  return res.data;
};
