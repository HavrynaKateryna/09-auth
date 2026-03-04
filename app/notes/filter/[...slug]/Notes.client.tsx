"use client";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";

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

  const { data, isLoading, isError, isFetching } =
    useQuery({
      queryKey: ["notes", { query, page, tag }],
      queryFn: () => fetchNotes(query, page, tag),
      placeholderData: keepPreviousData,
      refetchOnMount: false,
      retry: false,
    });
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
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

        {data?.totalPages &&
          data?.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}

        <Link
          href={"/notes/action/create"}
          className={css.button}
        >
          Create note +
        </Link>
      </header>
      {isLoading && <p>Loading...</p>}
      {!isLoading && isFetching && (
        <p>Updating...</p>
      )}
      {notes?.length > 0 && !isError && (
        <NoteList notes={notes} />
      )}
    </div>
  );
}
