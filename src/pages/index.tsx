import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { register, handleSubmit, reset, watch } = useForm();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const watchedQuantities = watch();
  const totalPrice = products.reduce((acc, p, i) => {
    const qty = Number(watchedQuantities[`qty_${i}`]) || 0;
    return acc + qty * p.price;
  }, 0);

  const onSubmit = async (data: any) => {
    const items = products
      .filter((_, i) => Number(data[`qty_${i}`]) > 0)
      .map((p, i) => ({
        id: p.id,
        quantity: Number(data[`qty_${i}`]),
        price: Number(p.price),
      }));

    if (!items.length) {
      alert("No products selected for the order.");
      return;
    }

    const shabbatOptions: string[] = [];
    if (data.shabbat_veetchanan) shabbatOptions.push("ואתחנן");
    if (data.shabbat_ekev) shabbatOptions.push("עקב");

    if (!shabbatOptions.length) {
      alert("Please select at least one Shabbat.");
      return;
    }

    const orderIds: number[] = [];

    for (const week of shabbatOptions) {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email: data.email, week }),
      });

      const result = await res.json();
      if (result.id) {
        orderIds.push(result.id);
      }
    }

    router.push({
      pathname: "/confirmation",
      query: {
        ids: orderIds.join(","),
        weeks: shabbatOptions.join(","),
      },
    });

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        direction: "ltr",
        maxWidth: 700,
        margin: "0 auto",
        fontFamily: "Arial",
        background: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Product Order</h1>

      <input
        {...register("email")}
        placeholder="Your email"
        required
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
          border: "1px solid #ccc",
          borderRadius: 5,
        }}
      />

      <div style={{ marginBottom: 20 }}>
        <label>
          <input type="checkbox" {...register("shabbat_veetchanan")} /> שבת
          ואתחנן
        </label>
        <br />
        <label>
          <input type="checkbox" {...register("shabbat_ekev")} /> שבת עקב
        </label>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 20,
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Product</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>
              Price (CHF)
            </th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id}>
              <td style={{ padding: 10, border: "1px solid #eee" }}>
                {p.name}
              </td>
              <td style={{ padding: 10, border: "1px solid #eee" }}>
                {p.price}
              </td>
              <td
                style={{
                  padding: 10,
                  border: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <input
                  type="number"
                  {...register(`qty_${i}`)}
                  min="0"
                  style={{ width: 60, padding: 5, textAlign: "center" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10, fontWeight: "bold", fontSize: 18 }}>
        Total to pay: CHF {totalPrice.toFixed(2)}
      </div>

      <button
        type="submit"
        style={{
          marginTop: 20,
          width: "100%",
          padding: "10px 0",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Place Order
      </button>
    </form>
  );
}
