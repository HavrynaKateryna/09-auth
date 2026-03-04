import { fetchNoteById } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

interface SingleNoteProps {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({
  params,
}: SingleNoteProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return {
    title: `Info about: ${note.title}`,
    description: `${note.content}`,
    openGraph: {
      type: "website",
      url: `http://localhost:3000/notes/${id}`,
      title: `Info about: ${note.title}`,
      description: `${note.content}`,
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
}

export default async function NoteDetails({
  params,
}: SingleNoteProps) {
  const queryClient = new QueryClient();
  const { id } = await params;
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });
  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
