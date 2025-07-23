import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// טיפוס למוצר
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

    if (!items.length) {
      alert("לא נבחרו מוצרים להזמנה");
      return;
    }

    const shabbatOptions: string[] = [];
    if (data.shabbat_veetchanan) shabbatOptions.push("ואתחנן");
    if (data.shabbat_ekev) shabbatOptions.push("עקב");

    if (!shabbatOptions.length) {
      alert("יש לבחור לפחות שבת אחת");
      return;
    }
    console.log("שבתות שנבחרו:", shabbatOptions);

    for (const week of shabbatOptions) {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email: data.email, week }),
      });
    }

    alert("ההזמנה נשלחה בהצלחה!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        direction: "rtl",
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1>הזמנת מוצרים</h1>

      <input
        {...register("email")}
        placeholder="האימייל שלך"
        required
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <div style={{ marginBottom: 10 }}>
        <label>
          <input type="checkbox" {...register("shabbat_veetchanan")} /> שבת
          ואתחנן
        </label>
        <br />
        <label>
          <input type="checkbox" {...register("shabbat_ekev")} /> שבת עקב
        </label>
      </div>

      {products.map((p, i) => (
        <div key={p.id} style={{ marginBottom: 5 }}>
          {p.name} - ₪{p.price}
          <input
            type="number"
            {...register(`qty_${i}`)}
            min="0"
            defaultValue="0"
            style={{ marginRight: 10, width: 60 }}
          />
        </div>
      ))}

      <button type="submit" style={{ marginTop: 15, padding: "10px 20px" }}>
        בצע הזמנה
      </button>
    </form>
  );
}
