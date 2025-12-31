"use client";
import { useState } from "react";
import Box, { BoxType } from "./Box";

/* ================== GRID CONSTANTS ================== */
const CELL = 80;          // Cell size in px
const GAP = 6;            // Gap between cells
const STEP = CELL + GAP;  // One grid step (cell + gap)
const TOTAL_COLS = 10;    // Fixed number of columns

export default function Grid() {
  /* ================== STATE ================== */
  const [boxes, setBoxes] = useState<BoxType[]>([
    {
      id: 1,
      col: 1,
      row: 1,
      w: 4,
      h: 2,
      x: STEP * 1,
      y: STEP * 1,
      selected: false,
      color: "blue",
    },
    {
      id: 2,
      col: 6,
      row: 2,
      w: 2,
      h: 2,
      x: STEP * 5,
      y: STEP * 2,
      selected: false,
      color: "green",
    },
  ]);

  /* ================== HELPERS ================== */

  // Update a single box
  function updateBox(updated: BoxType) {
    setBoxes((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  }

  // Deselect all boxes and snap them to grid
  function deselectAll() {
    setBoxes((prev) =>
      prev.map((b) => {
        if (!b.selected) return b;

        const col = Math.round(b.x / STEP);
        const row = Math.round(b.y / STEP);

        return {
          ...b,
          selected: false,
          col,
          row,
          x: col * STEP,
          y: row * STEP,
        };
      })
    );
  }

  // Select exactly one box
  function selectBox(id: number) {
    setBoxes((prev) =>
      prev.map((b) => ({ ...b, selected: b.id === id }))
    );
  }

  // Ensure grid always has enough rows
  const totalRows = Math.max(...boxes.map((b) => b.row + b.h), 4);

  /* ================== RENDER ================== */
  return (
    <div className="grid-wrapper" onClick={deselectAll}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${TOTAL_COLS}, ${CELL}px)`,
          gridTemplateRows: `repeat(${totalRows}, ${CELL}px)`,
          gap: `${GAP}px`,
          width: STEP * TOTAL_COLS - GAP,
          height: STEP * totalRows - GAP,
        }}
      >
        {/* Background grid cells */}
        {Array.from({ length: TOTAL_COLS * totalRows }).map((_, i) => (
          <div key={i} className="cell" />
        ))}

        {/* Interactive boxes */}
        {boxes.map((box) => (
          <Box
            key={box.id}
            box={box}
            onUpdate={updateBox}
            onSelectBox={selectBox}
          />
        ))}
      </div>
    </div>
  );
}
