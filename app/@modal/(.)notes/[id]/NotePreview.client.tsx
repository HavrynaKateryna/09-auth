"use client";
import {
  useParams,
  useRouter,
} from "next/navigation";
import css from "./NotePreview.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
interface NotePreviewClientProps {}
export default function NotePreviewClient({}: NotePreviewClientProps) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
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
        <Modal onClose={() => router.back()}>
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
              <p className={css.tag}>
                {data.tag}
              </p>
              <p className={css.content}>
                {data.content}
              </p>
              <p className={css.date}>
                {data.createdAt}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
