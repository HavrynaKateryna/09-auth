import nextServer from "./api";
import type {
  NewNote,
  Note,
} from "../../types/note";
import { User } from "@/types/user";
interface AxiosNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface UserRequest {
  email: string;
  password: string;
}
interface CheckSessionRequest {
  success: boolean;
}
const ITEMS_PER_PAGE = 12;
export const fetchNotes = async (
  query: string,
  page: number,
  tag?: string,
): Promise<AxiosNotesResponse> => {
  const response =
    await nextServer.get<AxiosNotesResponse>(
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
  return response.data;
};
export const createNote = async (
  note: NewNote,
): Promise<Note> => {
  const response = await nextServer.post<Note>(
    "/notes",
    note,
  );
  return response.data;
};
export const deleteNote = async (
  id: string,
): Promise<Note> => {
  const response = await nextServer.delete<Note>(
    `/notes/${id}`,
  );
  return response.data;
};
export const fetchNoteById = async (
  id: string,
): Promise<Note> => {
  const response = await nextServer.get<Note>(
    `/notes/${id}`,
  );
  return response.data;
};
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
export const checkSession = async () => {
  const res =
    await nextServer.get<CheckSessionRequest>(
      "/auth/session",
    );
  return res.data.success;
};
export const getMe = async (): Promise<User> => {
  const { data } =
    await nextServer.get<User>("/users/me");
  return data;
};
