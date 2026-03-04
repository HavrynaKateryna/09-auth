import { fetchNoteById } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotePreviewClient from "./NotePreview.client";

interface SingleNoteProps {
  params: Promise<{ id: string }>;
}
export default async function NotePreview({
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
      <NotePreviewClient />
    </HydrationBoundary>
  );
}
