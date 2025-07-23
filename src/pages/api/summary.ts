import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

// טיפוס שמתאים למבנה שה-SELECT מחזיר (שדות מקוננים בתוך מערכים)
type OrderItemWithRelations = {
  quantity: number;
  order: { week: string }[]; // מקושר לטבלת orders
  product: { name: string }[]; // מקושר לטבלת products
};

type Summary = {
  week: string;
  product: string;
  total_quantity: number;
};

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from("order_items").select(`
    quantity,
    order:orders(week),
    product:products(name)
  `);

  if (error || !data) {
    return res.status(500).json({ error: error?.message || "No data" });
  }

  const typedData = data as OrderItemWithRelations[];

  const summaryMap = new Map<string, number>();

  for (const item of typedData) {
    const week = item.order?.[0]?.week || "ללא שבת";
    const name = item.product?.[0]?.name || "מוצר לא ידוע";
    const key = `${week}__${name}`;
    summaryMap.set(key, (summaryMap.get(key) || 0) + item.quantity);
  }

  const summary: Summary[] = Array.from(summaryMap.entries()).map(
    ([key, qty]) => {
      const [week, product] = key.split("__");
      return { week, product, total_quantity: qty };
    }
  );

  res.status(200).json(summary);
}
