import nextServer from "./api";
import type { NewNote, Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// ───── ЗАМЕТКИ ─────
const ITEMS_PER_PAGE = 12;

export const fetchNotes = async (
  query: string,
  page: number,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const res =
    await nextServer.get<FetchNotesResponse>(
      "/notes",
      {
        params: {
          page,
          perPage: ITEMS_PER_PAGE,
          ...(query.trim()
            ? { search: query }
            : {}),
          tag:
            tag === "all" || !tag
              ? undefined
              : tag,
        },
      },
    );
  return res.data;
};

export const fetchNoteById = async (
  id: string,
): Promise<Note> => {
  const res = await nextServer.get<Note>(
    `/notes/${id}`,
  );
  return res.data;
};

export const createNote = async (
  note: NewNote,
): Promise<Note> => {
  const res = await nextServer.post<Note>(
    "/notes",
    note,
  );
  return res.data;
};

export const deleteNote = async (
  id: string,
): Promise<Note> => {
  const res = await nextServer.delete<Note>(
    `/notes/${id}`,
  );
  return res.data;
};

// ───── АВТОРИЗАЦИЯ ─────
export interface UserRequest {
  email: string;
  password: string;
}

export const register = async (
  userData: UserRequest,
): Promise<User> => {
  const { data } = await nextServer.post<User>(
    "/auth/register",
    userData,
  );
  return data;
};

export const login = async (
  userData: UserRequest,
): Promise<User> => {
  const { data } = await nextServer.post<User>(
    "/auth/login",
    userData,
  );
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};
