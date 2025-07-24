import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { register, handleSubmit, reset } = useForm();

  const load = () =>
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: any) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    load();
  };

  const del = async (id: number) => {
    await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    });
    load();
  };

  return (
    <div
      style={{
        direction: "rtl",
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "Arial",
        background: "#f9f9f9",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>ניהול מוצרים</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          {...register("name")}
          placeholder="שם מוצר"
          required
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            textAlign: "right",
          }}
        />
        <input
          type="number"
          {...register("price")}
          placeholder="מחיר"
          required
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            textAlign: "right",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: 10,
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          הוסף מוצר
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {p.name} - CHF {p.price}
            </span>
            <button
              onClick={() => del(p.id)}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: 5,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              מחק
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
