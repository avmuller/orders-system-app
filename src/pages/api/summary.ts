import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

// טיפוס שמתאים בדיוק למה שחוזר מהשאילתה של Supabase
type OrderItemWithRelations = {
  quantity: number;
  order: { week: string }; // ✅ אובייקט ולא מערך
  product: { name: string }; // ✅ אובייקט ולא מערך
};

// טיפוס הפלט
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
    return res
      .status(500)
      .json({ error: error?.message || "Failed to fetch data" });
  }

  const typedData: OrderItemWithRelations[] = data.map((item: any) => ({
    quantity: item.quantity,
    order: Array.isArray(item.order) ? item.order[0] : item.order,
    product: Array.isArray(item.product) ? item.product[0] : item.product,
  }));

  const summaryMap = new Map<string, number>();

  for (const item of typedData) {
    const week = item.order?.week || "שבת לא ידועה";
    const product = item.product?.name || "מוצר לא ידוע";
    const key = `${week}__${product}`;

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
