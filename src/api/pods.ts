// src/api/rpc.ts (frontend helper, NOT the Vercel api folder)
export default async function getPodsWithStats() {
  const res = await fetch("/api/rpc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pods");
  }

  return res.json();
}
