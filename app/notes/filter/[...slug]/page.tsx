import { fetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";
interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}
export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";
  return {
    title: `Notes List by tag: ${tag}`,
    description: `List of notes which belongs to ${tag} tag`,
    openGraph: {
      type: "website",
      url: `http://localhost:3000/notes/filter/${tag}`,
      title: `Notes List by tag: ${tag}`,
      description: `List of notes which belongs to ${tag} tag`,
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
export default async function NotesPage({
  params,
}: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "notes",
      { query: "", page: 1, tag },
    ],
    queryFn: () => fetchNotes("", 1, tag),
  });
  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
