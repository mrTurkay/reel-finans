export default function PaymentPlanTable({ odemePlani, fmt }) {
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderRadius: 12,
        padding: 14,
        maxHeight: 400,
        overflowY: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 11,
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #21262d" }}>
            {["Ay", "Nominal", "Reel Değer", "Küm. Nominal", "Küm. Reel"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "8px 4px",
                  color: "#4a5568",
                  fontWeight: 600,
                  textAlign: "right",
                  fontSize: 10,
                  textTransform: "uppercase",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {odemePlani.map((row) => (
            <tr
              key={row.ay}
              className={row.isTeslim ? "teslim-row" : ""}
              style={{
                borderBottom: "1px solid rgba(33,38,45,0.5)",
                background: row.isTeslim ? "rgba(214,158,46,0.08)" : "transparent",
              }}
            >
              <td
                style={{
                  padding: "5px 4px",
                  color: row.isTeslim ? "#d69e2e" : "#a0aec0",
                  fontFamily: "monospace",
                  fontWeight: row.isTeslim ? 700 : 400,
                }}
              >
                {row.label} {row.isTeslim && "📍"}
              </td>
              <td
                style={{
                  padding: "5px 4px",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#e2e8f0",
                }}
              >
                {fmt(row.nominal)} ₺
              </td>
              <td
                style={{
                  padding: "5px 4px",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#48bb78",
                }}
              >
                {fmt(row.reel)} ₺
              </td>
              <td
                style={{
                  padding: "5px 4px",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#718096",
                }}
              >
                {fmt(row.kumulatifNominal)} ₺
              </td>
              <td
                style={{
                  padding: "5px 4px",
                  textAlign: "right",
                  fontFamily: "monospace",
                  color: "#718096",
                }}
              >
                {fmt(row.kumulatifReel)} ₺
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
