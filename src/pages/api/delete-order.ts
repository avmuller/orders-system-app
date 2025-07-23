import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end();
  }

  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "Missing order ID" });

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
