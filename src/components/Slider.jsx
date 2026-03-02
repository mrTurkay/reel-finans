import { useState, useRef } from "react";
import { fmt, fmtDec } from "../utils/format";

export default function Slider({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = 1,
  hint,
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);

  const displayValue =
    suffix === "₺"
      ? `${fmt(value)} ₺`
      : `${fmtDec(value, step < 1 ? 1 : 0)}${suffix}`;

  const startEdit = () => {
    setEditText(String(step < 1 ? value : Math.round(value)));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    setEditing(false);
    const raw = editText.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(min, num));
      const snapped = Math.round(clamped / step) * step;
      onChange(parseFloat(snapped.toFixed(10)));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  };

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 5,
        }}
      >
        <label style={{ fontSize: 12.5, color: "#a0aec0", fontWeight: 500 }}>
          {label}
        </label>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: 14,
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 700,
              background: "#2d3748",
              border: "1px solid #d69e2e",
              borderRadius: 4,
              padding: "1px 6px",
              width: 100,
              textAlign: "right",
              outline: "none",
            }}
          />
        ) : (
          <span
            onClick={startEdit}
            title="Düzenlemek için tıklayın"
            style={{
              fontSize: 14,
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 700,
              cursor: "pointer",
              borderBottom: "1px dashed #d69e2e",
              paddingBottom: 1,
            }}
          >
            {displayValue}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="custom-range"
        style={{ "--pct": `${pct}%` }}
      />
      {hint && (
        <div
          style={{
            fontSize: 10.5,
            color: "#4a5568",
            marginTop: "10px !important",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
