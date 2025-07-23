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
  order_code: string;
  email: string;
  created_at: string;
  order_items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders-list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Invalid data:", data);
        }
      });
  }, []);

  return (
    <div>
      <h1>כל ההזמנות</h1>
      {orders.map((order) => {
        const total = order.order_items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );

        return (
          <div
            key={order.id}
            style={{
              border: "1px solid black",
              marginBottom: 20,
              padding: 10,
            }}
          >
            <strong>מספר הזמנה:</strong> {order.id}
            <br />
            <strong>קוד הזמנה:</strong> {order.order_code}
            <br />
            <strong>אימייל:</strong> {order.email}
            <br />
            <strong>תאריך:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
            <br />
            <ul>
              {order.order_items.map((item, i) => (
                <li key={i}>
                  {item.product?.name ?? "מוצר לא ידוע"} – כמות: {item.quantity}{" "}
                  – ₪{item.price} ליחידה – סה"כ ₪{item.quantity * item.price}
                </li>
              ))}
            </ul>
            <strong>סה״כ להזמנה:</strong> ₪{total}
          </div>
        );
      })}
    </div>
  );
}
