import {
  Canvas,
  Circle,
  PencilBrush,
  Rect,
  type FabricObject,
  type TPointerEventInfo,
} from "fabric";

import type { CanvasSnapshot, DrawingTool } from "../types/drawing";

type CanvasControllerOptions = {
  canvasElement: HTMLCanvasElement;
  width: number;
  height: number;
  onChange: (snapshot: CanvasSnapshot) => void;
};

type ToolStyle = {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
};

export class DrawingCanvasController {
  private canvas: Canvas;
  private activeTool: DrawingTool = "select";
  private style: ToolStyle = {
    fillColor: "rgba(20, 184, 166, 0.18)",
    strokeColor: "#0f172a",
    strokeWidth: 3,
  };
  private draftObject: FabricObject | null = null;
  private startPoint: { x: number; y: number } | null = null;
  private isHydrating = false;
  private notifyChange: (snapshot: CanvasSnapshot) => void;

  constructor({
    canvasElement,
    width,
    height,
    onChange,
  }: CanvasControllerOptions) {
    this.notifyChange = onChange;
    this.canvas = new Canvas(canvasElement, {
      width,
      height,
      backgroundColor: "#fbfaf8",
      preserveObjectStacking: true,
      selection: true,
    });

    this.canvas.freeDrawingBrush = new PencilBrush(this.canvas);
    this.bindEvents();
    this.setTool("select");
  }

  setDimensions(width: number, height: number) {
    this.canvas.setDimensions({ width, height });
    this.canvas.requestRenderAll();
  }

  setTool(tool: DrawingTool) {
    this.activeTool = tool;
    this.canvas.isDrawingMode = tool === "free-draw";
    this.canvas.selection = tool === "select";
    this.canvas.defaultCursor = tool === "free-draw" ? "crosshair" : "default";

    this.canvas.getObjects().forEach((object) => {
      object.selectable = tool === "select";
      object.evented = tool === "select";
    });

    this.syncBrush();
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  setStyle(style: Partial<ToolStyle>) {
    this.style = { ...this.style, ...style };
    this.syncBrush();
  }

  deleteSelection() {
    const activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach((object) => this.canvas.remove(object));
    this.canvas.discardActiveObject();
    this.emitChange();
  }

  exportSnapshot(): CanvasSnapshot {
    return this.canvas.toJSON() as CanvasSnapshot;
  }

  async loadSnapshot(snapshot: CanvasSnapshot) {
    this.isHydrating = true;
    await this.canvas.loadFromJSON(snapshot);
    this.canvas.getObjects().forEach((object) => {
      object.selectable = this.activeTool === "select";
      object.evented = this.activeTool === "select";
    });
    this.canvas.requestRenderAll();
    this.isHydrating = false;
  }

  dispose() {
    this.canvas.dispose();
  }

  private bindEvents() {
    this.canvas.on("mouse:down", (event) => this.handleMouseDown(event));
    this.canvas.on("mouse:move", (event) => this.handleMouseMove(event));
    this.canvas.on("mouse:up", () => this.handleMouseUp());
    this.canvas.on("object:modified", () => this.emitChange());
    this.canvas.on("path:created", () => this.emitChange());
  }

  private handleMouseDown(event: TPointerEventInfo) {
    if (this.activeTool !== "rectangle" && this.activeTool !== "circle") {
      return;
    }

    const pointer = this.canvas.getScenePoint(event.e);
    this.startPoint = pointer;

    if (this.activeTool === "rectangle") {
      this.draftObject = new Rect({
        left: pointer.x,
        top: pointer.y,
        width: 1,
        height: 1,
        fill: this.style.fillColor,
        stroke: this.style.strokeColor,
        strokeWidth: this.style.strokeWidth,
      });
    }

    if (this.activeTool === "circle") {
      this.draftObject = new Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 1,
        fill: this.style.fillColor,
        stroke: this.style.strokeColor,
        strokeWidth: this.style.strokeWidth,
      });
    }

    if (this.draftObject) {
      this.draftObject.selectable = false;
      this.canvas.add(this.draftObject);
    }
  }

  private handleMouseMove(event: TPointerEventInfo) {
    if (!this.startPoint || !this.draftObject) {
      return;
    }

    const pointer = this.canvas.getScenePoint(event.e);
    const width = Math.abs(pointer.x - this.startPoint.x);
    const height = Math.abs(pointer.y - this.startPoint.y);
    const left = Math.min(pointer.x, this.startPoint.x);
    const top = Math.min(pointer.y, this.startPoint.y);

    if (this.draftObject.type === "rect") {
      this.draftObject.set({ left, top, width, height });
    }

    if (this.draftObject.type === "circle") {
      this.draftObject.set({
        left,
        top,
        radius: Math.max(width, height) / 2,
      });
    }

    this.canvas.requestRenderAll();
  }

  private handleMouseUp() {
    if (!this.draftObject) {
      return;
    }

    this.draftObject.selectable = this.activeTool === "select";
    this.draftObject.evented = this.activeTool === "select";
    this.draftObject.setCoords();
    this.draftObject = null;
    this.startPoint = null;
    this.emitChange();
  }

  private syncBrush() {
    if (!this.canvas.freeDrawingBrush) {
      return;
    }

    this.canvas.freeDrawingBrush.color = this.style.strokeColor;
    this.canvas.freeDrawingBrush.width = this.style.strokeWidth;
  }

  private emitChange() {
    if (!this.isHydrating) {
      this.notifyChange(this.exportSnapshot());
    }
  }
}
