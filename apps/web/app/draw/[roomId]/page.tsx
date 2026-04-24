import { DrawingApp } from "@/src/features/drawing/components/drawing-app";

export default async function RoomDrawingPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return <DrawingApp roomId={decodeURIComponent(roomId)} />;
}
