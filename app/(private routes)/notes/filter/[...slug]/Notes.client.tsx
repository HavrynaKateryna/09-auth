"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import css from "./NotesPage.module.css";

// Тип данных, которые возвращает fetchNotes
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({
  tag,
}: NotesClientProps) {
  const [searchTerm, setSearchTerm] =
    useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Запрос с React Query
  const { data, isLoading, isError, isFetching } =
    useQuery<FetchNotesResponse>({
      queryKey: ["notes", { query, page, tag }],
      queryFn: () =>
        fetchNotes({ query, page, tag }), // Передаем объект с параметрами
      refetchOnMount: false,
      retry: false,
      keepPreviousData: true, // правильно внутри useQuery
    });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  // Debounce для поиска
  const debouncedQuery = useDebouncedCallback(
    (value: string) => {
      setQuery(value);
      setPage(1);
    },
    500,
  );

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedQuery(value);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchTerm}
          onChange={handleSearch}
        />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <Link
          href="/notes/action/create"
          className={css.button}
        >
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}
      {!isLoading && isFetching && (
        <p>Updating...</p>
      )}
      {isError && <p>Something went wrong.</p>}

      {notes.length > 0 && !isError && (
        <NoteList notes={notes} />
      )}
    </div>
  );
}
