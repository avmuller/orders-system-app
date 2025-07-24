import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { items, email, week } = req.body;
    const order_code = uuidv4();

    const { data, error } = await supabase
      .from("orders")
      .insert({ order_code, email, week })
      .select(); // מקבל את השורה המלאה בחזרה כולל id

    if (error || !data || data.length === 0) {
      return res.status(500).json({ error: error?.message || "Insert failed" });
    }

    const order_id = data[0].id; // זה המספר שאתה רוצה

    const order_items = items.map((item: any) => ({
      order_id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: e2 } = await supabase
      .from("order_items")
      .insert(order_items);

    if (e2) return res.status(500).json({ error: e2.message });

    return res.status(201).json({ id: order_id }); // ⬅️ מחזיר רק את ה-id הפשוט
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end();
}
