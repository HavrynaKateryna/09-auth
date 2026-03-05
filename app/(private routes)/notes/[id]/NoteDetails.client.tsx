"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import css from "./NoteDetails.module.css";
import { fetchNoteById } from "@/lib/api/clientApi";
import { Note } from "@/types/note"; // <-- исправлено: импорт типа из types/note

interface NoteDetailsClientProps {
  noteId: string;
}

export default function NoteDetailsClient({
  noteId,
}: NoteDetailsClientProps) {
  const router = useRouter();

  const { data, isLoading, error } =
    useQuery<Note>({
      queryKey: ["note", noteId],
      queryFn: () => fetchNoteById(noteId),
      enabled: Boolean(noteId),
      refetchOnMount: false,
      retry: false,
    });

  return (
    <>
      {isLoading && (
        <p>Loading, please wait...</p>
      )}

      {!isLoading && error && (
        <p>Something went wrong.</p>
      )}

      {!isLoading && !error && data && (
        <div className={css.container}>
          <button
            className={css.backBtn}
            onClick={() => router.back()}
          >
            Go Back
          </button>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{data.title}</h2>
            </div>
            <p className={css.tag}>{data.tag}</p>
            <p className={css.content}>
              {data.content}
            </p>
            <p className={css.date}>
              {data.createdAt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
