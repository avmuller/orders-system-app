import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from("orders").select(`
    id,
    order_code,
    email,
    week,
    created_at,
    order_items(
      quantity,
      price,
      product:products!order_items_product_id_fkey(name)
    )
  `);

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data ?? []);
}
