import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const onSubmit = async (data: any) => {
    const items = products
      .filter((_, i) => data[`qty_${i}`] > 0)
      .map((p, i) => ({
        id: p.id,
        quantity: Number(data[`qty_${i}`]),
        price: Number(p.price),
      }));

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, email: data.email }),
    });

    const result = await res.json();
    alert("ההזמנה התקבלה! קוד הזמנה: " + result.order_code);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>הזמנת מוצרים</h1>
      <input {...register("email")} placeholder="האימייל שלך" required />
      <br />
      {products.map((p, i) => (
        <div key={p.id}>
          {p.name} - ₪{p.price}
          <input
            type="number"
            {...register(`qty_${i}`)}
            min="0"
            defaultValue="0"
          />
        </div>
      ))}
      <button type="submit">בצע הזמנה</button>
    </form>
  );
}
