import { useEffect, useState } from "react";

type Summary = {
  week: string;
  product: string;
  total_quantity: number;
};

export default function SummaryPage() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch("/api/summary");
        const data = await res.json();
        setSummary(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  // קיבוץ לפי שבת
  const grouped = summary.reduce<Record<string, Summary[]>>((acc, item) => {
    if (!acc[item.week]) acc[item.week] = [];
    acc[item.week].push(item);
    return acc;
  }, {});

  if (loading) return <p>טוען נתונים...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}>
      <h1 style={{ textAlign: "center" }}>סיכום הזמנות לפי שבת</h1>

      {Object.entries(grouped).map(([week, items]) => (
        <div key={week} style={{ marginBottom: "2rem" }}>
          <h2 style={{ textAlign: "center" }}>{week}</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={cellStyle}>מוצר</th>
                <th style={cellStyle}>סה״כ כמות</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={cellStyle}>{item.product}</td>
                  <td style={cellStyle}>{item.total_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center" as const,
};
