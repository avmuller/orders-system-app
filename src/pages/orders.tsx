import { useEffect, useState } from "react";

// טיפוס להזמנה
type Order = {
  id: number;
  order_code: string;
  email: string;
  created_at: string;
  order_items: {
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders-list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Invalid data from server:", data);
          setError("שגיאה בטעינת ההזמנות");
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error("Network or server error:", err);
        setError("שגיאה בתקשורת עם השרת");
        setOrders([]);
      });
  }, []);

  return (
    <div>
      <h1>כל ההזמנות</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid black",
            marginBottom: 10,
            padding: 10,
          }}
        >
          <strong>הזמנה:</strong> {order.order_code}
          <br />
          <strong>אימייל:</strong> {order.email}
          <br />
          <strong>תאריך:</strong> {new Date(order.created_at).toLocaleString()}
          <br />
          <ul>
            {order.order_items.map((item, i) => (
              <li key={i}>
                {item.product.name} - כמות: {item.quantity} - ₪{item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
