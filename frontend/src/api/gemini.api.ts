export async function generateDishScript(dish: string) {
  console.log("Sending to backend:", dish);

  const res = await fetch("http://localhost:3000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dish }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "AI API error");
  }

  return data; 
}
