"use client";
import css from "./NoteForm.module.css";
import { useId } from "react";
import type {
  NewNote,
  NoteTag,
} from "../../types/note";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createNote } from "../../lib/api";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useRouter } from "next/navigation";

export default function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } =
    useNoteDraftStore();
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      clearDraft();
      router.back();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });
  const handleInputChanged = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const value = {
      ...draft,
      [e.target.name]: e.target.value,
    };
    setDraft(value);
  };
  const handleSubmit = async (
    formData: FormData,
  ) => {
    const newNote: NewNote = {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      tag: formData.get("tag") as NoteTag,
    };
    createMutation.mutate(newNote);
  };
  return (
    <form
      className={css.form}
      action={handleSubmit}
    >
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>
          Title
        </label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          onChange={handleInputChanged}
          defaultValue={draft.title}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>
          Content
        </label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          onChange={handleInputChanged}
          defaultValue={draft.content}
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>
          Tag
        </label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          onChange={handleInputChanged}
          defaultValue={draft.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">
            Personal
          </option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">
            Shopping
          </option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
