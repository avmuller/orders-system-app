import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
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
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div>
      <h1>ניהול מוצרים</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} placeholder="שם מוצר" required />
        <input
          type="number"
          {...register("price")}
          placeholder="מחיר"
          required
        />
        <button type="submit">הוסף</button>
      </form>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ₪{p.price} <button onClick={() => del(p.id)}>מחק</button>
          </li>
        ))}import { useEffect, useState } from "react";
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
            await fetch("/api/products", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            });
            load();
          };
        
          return (
            <div>
              <h1>ניהול מוצרים</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name")} placeholder="שם מוצר" required />
                <input
                  type="number"
                  {...register("price")}
                  placeholder="מחיר"
                  required
                />
                <button type="submit">הוסף</button>
              </form>
              <ul>
                {products.map((p) => (
                  <li key={p.id}>
                    {p.name} - ₪{p.price} <button onClick={() => del(p.id)}>מחק</button>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
      </ul>
    </div>
  );
}
