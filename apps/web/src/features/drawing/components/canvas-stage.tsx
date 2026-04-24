"use client";

import { useEffect } from "react";

import { useFabricCanvas } from "../hooks/use-fabric-canvas";

type CanvasStageProps = {
  onDeleteSelection: (handler: () => void) => void;
};

export function CanvasStage({ onDeleteSelection }: CanvasStageProps) {
  const { wrapperRef, canvasRef, deleteSelection } = useFabricCanvas();

  useEffect(() => {
    onDeleteSelection(deleteSelection);
  }, [deleteSelection, onDeleteSelection]);

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-md border border-neutral-200 bg-[#fbfaf8] shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div ref={wrapperRef} className="h-full w-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
