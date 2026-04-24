"use client";

import type { ComponentType } from "react";

import {
  Circle,
  MousePointer2,
  Pencil,
  Square,
  Trash2,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useDrawingStore } from "../store/drawing-store";
import type { DrawingTool } from "../types/drawing";

const tools: Array<{
  id: DrawingTool;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "free-draw", label: "Free draw", icon: Pencil },
];

type DrawingToolbarProps = {
  onDeleteSelection: () => void;
};

export function DrawingToolbar({ onDeleteSelection }: DrawingToolbarProps) {
  const activeTool = useDrawingStore((state) => state.activeTool);
  const setActiveTool = useDrawingStore((state) => state.setActiveTool);

  return (
    <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {tools.map((tool) => {
        const Icon = tool.icon;

        return (
          <Button
            aria-label={tool.label}
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            size="icon"
            title={tool.label}
            type="button"
            variant={activeTool === tool.id ? "active" : "ghost"}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
      <div className="mx-1 h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
      <Button
        aria-label="Delete selection"
        onClick={onDeleteSelection}
        size="icon"
        title="Delete selection"
        type="button"
        variant="ghost"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
