import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("products").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  if (req.method === "POST") {
    const { name, price } = req.body;
    const { data, error } = await supabase.from("products").insert({ name, price });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }
  if (req.method === "PUT") {
    const { id, name, price } = req.body;
    const { data, error } = await supabase.from("products").update({ name, price }).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }
  res.setHeader("Allow", ["GET","POST","PUT","DELETE"]);
  return res.status(405).end();
}
