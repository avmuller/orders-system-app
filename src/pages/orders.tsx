import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders-list").then(res => res.json()).then(setOrders);
  }, []);

  return (
    <div>
      <h1>כל ההזמנות</h1>
      {orders.map(order => (
        <div key={order.id} style={{ border: "1px solid black", marginBottom: 10, padding: 10 }}>
          <strong>הזמנה: </strong>{order.order_code}<br />
          <strong>אימייל: </strong>{order.email}<br />
          <strong>תאריך: </strong>{new Date(order.created_at).toLocaleString()}<br />
          <ul>
            {order.order_items.map((item, i) => (
              <li key={i}>{item.product.name} - כמות: {item.quantity} - ₪{item.price}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
