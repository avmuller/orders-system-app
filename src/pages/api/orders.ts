import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { items, email } = req.body;
    const order_code = uuidv4();
    const { data, error } = await supabase
      .from("orders")
      .insert({ order_code, email });
    if (error) return res.status(500).json({ error: error.message });

    const order_id = data[0].id;
    const lineInserts = items.map((it: any) => ({
      order_id,
      product_id: it.id,
      quantity: it.quantity,
      price: it.price
    }));
    const { error: e2 } = await supabase.from("order_items").insert(lineInserts);
    if (e2) return res.status(500).json({ error: e2.message });
    return res.status(201).json({ order_code });
  }
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end();
}
