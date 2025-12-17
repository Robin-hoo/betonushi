import { api } from "./client";

export async function generateDishScript(dish: string) {
  console.log("Sending to backend:", dish);

  const res = await api.post("/generate", { dish });

  return res.data;
}
