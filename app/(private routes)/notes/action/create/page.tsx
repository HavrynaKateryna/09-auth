import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Note",
  description: "Page for creating notes",
  openGraph: {
    type: "website",
    url: "http://localhost:3000/notes/action/create",
    title: "Create Note",
    description: "page for creating notes",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 600,
        height: 300,
        alt: "Notehub main logo",
      },
    ],
  },
};
export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
