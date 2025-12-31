"use client";
import React from "react";

/* ================== CONSTANTS ================== */
const CELL = 80;
const GAP = 6;
const STEP = CELL + GAP;
const TOTAL_COLS = 10;

type ResizeDir = "tl" | "tr" | "bl" | "br";

/* ================== TYPES ================== */
export type BoxType = {
  id: number;
  col: number;
  row: number;
  w: number;
  h: number;
  x: number;
  y: number;
  selected: boolean;
  color: "blue" | "green";
};

type BoxProps = {
  box: BoxType;
  onUpdate: (b: BoxType) => void;
  onSelectBox: (id: number) => void;
};

export default function Box({ box, onUpdate, onSelectBox }: BoxProps) {
  /* ================== DERIVED VALUES ================== */
  const width = box.w * CELL + GAP * (box.w - 1);
  const height = box.h * CELL + GAP * (box.h - 1);

  /* ================== DRAG ================== */
  const startDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectBox(box.id);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = box.x;
    const startY = box.y;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;

      const maxX = STEP * TOTAL_COLS - width;

      onUpdate({
        ...box,
        x: Math.min(Math.max(0, startX + dx), maxX),
        y: Math.max(0, startY + dy),
        selected: true,
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  /* ================== RESIZE ================== */
  const startResize = (dir: ResizeDir) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectBox(box.id);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = box.x;
    const startY = box.y;
    const startW = box.w;
    const startH = box.h;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;

      let newX = startX;
      let newY = startY;
      let newW = startW;
      let newH = startH;

      if (dir.includes("r"))
        newW = Math.round((startW * STEP + dx + GAP) / STEP);

      if (dir.includes("l")) {
        newW = Math.round((startW * STEP - dx + GAP) / STEP);
        newX = startX + dx;
      }

      if (dir.includes("b"))
        newH = Math.round((startH * STEP + dy + GAP) / STEP);

      if (dir.includes("t")) {
        newH = Math.round((startH * STEP - dy + GAP) / STEP);
        newY = startY + dy;
      }

      onUpdate({
        ...box,
        x: newX,
        y: newY,
        w: Math.max(1, newW),
        h: Math.max(1, newH),
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  /* ================== RENDER ================== */
  if (box.selected) {
    return (
      <div
        className={`box ${box.color} absolute`}
        style={{ width, height, left: box.x, top: box.y }}
        onMouseDown={startDrag}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="resize tl" onMouseDown={startResize("tl")} />
        <div className="resize tr" onMouseDown={startResize("tr")} />
        <div className="resize bl" onMouseDown={startResize("bl")} />
        <div className="resize br" onMouseDown={startResize("br")} />
      </div>
    );
  }

  return (
    <div
      className={`box ${box.color}`}
      style={{
        gridColumn: `${box.col + 1} / span ${box.w}`,
        gridRow: `${box.row + 1} / span ${box.h}`,
      }}
      onMouseDown={startDrag}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
