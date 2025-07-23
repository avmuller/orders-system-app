import { useEffect, useState } from "react";

type Summary = {
  week: string;
  product: string;
  total_quantity: number;
};

export default function SummaryPage() {
  const [data, setData] = useState<Summary[]>([]);

  useEffect(() => {
    fetch("/api/summary")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const weeks = Array.from(new Set(data.map((d) => d.week)));

  return (
    <div
      style={{
        direction: "rtl",
        fontFamily: "Arial",
        padding: 20,
        textAlign: "center",
      }}
    >
      <h2>סיכום הזמנות לפי שבת</h2>

      {weeks.map((week) => (
        <div key={week} style={{ marginBottom: 30 }}>
          <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: 5 }}>
            {week}
          </h3>
          <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "5px 10px", border: "1px solid #ccc" }}>
                  מוצר
                </th>
                <th style={{ padding: "5px 10px", border: "1px solid #ccc" }}>
                  סה״כ כמות
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((d) => d.week === week)
                .map((item, i) => (
                  <tr key={i}>
                    <td
                      style={{ padding: "5px 10px", border: "1px solid #ccc" }}
                    >
                      {item.product}
                    </td>
                    <td
                      style={{ padding: "5px 10px", border: "1px solid #ccc" }}
                    >
                      {item.total_quantity}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
