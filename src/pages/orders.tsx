import { useEffect, useState } from "react";

type OrderItem = {
  quantity: number;
  price: number;
  product: {
    name: string;
  };
};

type Order = {
  id: number;
  created_at: string;
  week: string | null;
  email: string;
  order_items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterWeek, setFilterWeek] = useState("");
  const [searchId, setSearchId] = useState(""); // ✅ שדה חיפוש לפי ID

  useEffect(() => {
    fetch("/api/orders-list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
        }
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(`האם למחוק הזמנה מס' ${id}?`)) return;

    const res = await fetch("/api/delete-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } else {
      alert("שגיאה במחיקה");
    }
  };

  // 🔎 סינון לפי שבוע ו/או ID
  const filtered = orders.filter((o) => {
    const matchesWeek = filterWeek
      ? (o.week || "").trim() === filterWeek
      : true;
    const matchesId = searchId
      ? o.id.toString().includes(searchId.trim())
      : true;
    return matchesWeek && matchesId;
  });

  return (
    <div
      style={{
        direction: "rtl",
        fontFamily: "Arial",
        padding: 20,
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "20px" }}>רשימת הזמנות</h2>

      {/* 🔍 חיפוש לפי ID */}
      <input
        type="text"
        placeholder="חפש לפי מספר הזמנה"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        style={{
          marginBottom: 10,
          padding: "5px 10px",
          fontSize: "15px",
          width: "200px",
        }}
      />

      {/* סינון לפי שבוע */}
      <select
        onChange={(e) => setFilterWeek(e.target.value)}
        value={filterWeek}
        style={{
          marginBottom: 20,
          marginRight: 10,
          padding: "5px 10px",
          fontSize: "15px",
        }}
      >
        <option value="">הצג הכל</option>
        <option value="ואתחנן">ואתחנן</option>
        <option value="עקב">עקב</option>
      </select>

      {filtered.map((order) => {
        const total = order.order_items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );

        return (
          <div
            key={order.id}
            style={{
              maxWidth: 600,
              margin: "20px auto",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "16px",
              background: "#fafafa",
              fontSize: "15px",
              textAlign: "right",
            }}
          >
            {/* 📦 פרטי הזמנה עם רווחים */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ marginBottom: 5 }}>
                <strong>מספר הזמנה:</strong> {order.id}
              </div>
              <div style={{ marginBottom: 5 }}>
                <strong>שבת:</strong> {order.week || "—"}
              </div>
              <div style={{ marginBottom: 5 }}>
                <strong>תאריך:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </div>
              <div style={{ fontSize: "14px", color: "#555" }}>
                <strong>אימייל:</strong> {order.email || "—"}
              </div>
            </div>

            <table style={{ width: "100%", marginTop: 10 }}>
              <thead>
                <tr style={{ background: "#eee" }}>
                  <th>מוצר</th>
                  <th>כמות</th>
                  <th>מחיר</th>
                  <th>סה״כ</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.product?.name}</td>
                    <td>{item.quantity}</td>
                    <td>₪{item.price}</td>
                    <td>₪{item.quantity * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 10 }}>
              <strong>סה״כ להזמנה:</strong> ₪{total}
            </div>

            <button
              onClick={() => handleDelete(order.id)}
              style={{
                marginTop: 10,
                padding: "5px 10px",
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              מחק הזמנה
            </button>
          </div>
        );
      })}
    </div>
  );
}
