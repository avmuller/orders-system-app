import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing order ID" });
  }

  // מחיקת ההזמנה מהטבלה order_items קודם (אם יש קשר זר)
  const { error: deleteItemsError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", id);

  if (deleteItemsError) {
    return res.status(500).json({ error: deleteItemsError.message });
  }

  // ואז מחיקת ההזמנה עצמה
  const { error: deleteOrderError } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (deleteOrderError) {
    return res.status(500).json({ error: deleteOrderError.message });
  }

  return res.status(200).json({ success: true });
}
