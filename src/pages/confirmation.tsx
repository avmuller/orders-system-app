import { useRouter } from "next/router";

export default function ConfirmationPage() {
  const router = useRouter();
  const { ids, weeks, items, total } = router.query;

  const idList = typeof ids === "string" ? ids.split(",") : [];
  const weekList = typeof weeks === "string" ? weeks.split(",") : [];
  const parsedItems =
    typeof items === "string" ? JSON.parse(decodeURIComponent(items)) : [];

  return (
    <div
      style={{
        direction: "ltr",
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "Arial",
        background: "#f1f1f1",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginTop: 50,
      }}
    >
      <h2 style={{ textAlign: "center", color: "green" }}>
        Order submitted successfully!
      </h2>

      <p style={{ marginTop: 10, color: "#333", fontWeight: "bold" }}>
        Please remember your order ID(s) for collecting the products.
      </p>

      <h3 style={{ marginTop: 30 }}>Order ID(s)</h3>
      <ul>
        {idList.map((id, i) => (
          <li key={i}>
            <strong>{weekList[i]}:</strong> {id}
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>Ordered Items</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#ddd" }}>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Product</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Qty</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {parsedItems.map((item: any, i: number) => (
            <tr key={i}>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {item.name}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {item.quantity}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                CHF {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20, fontWeight: "bold", fontSize: 16 }}>
        Total: CHF {total}
      </div>

      <p style={{ marginTop: 20 }}>
        If you'd like to modify your order, please contact us at:{" "}
        <a href="mailto:f67646@gmail.com">f67646@gmail.com</a>
      </p>
    </div>
  );
}
