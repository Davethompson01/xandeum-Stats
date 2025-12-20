// /api/rpc.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs",
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ---- CORS ----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Ensure body exists
    if (!req.body) {
      return res.status(400).json({ error: "Missing request body" });
    }

    // Forward request to RPC server
    const rpcResponse = await fetch("http://161.97.97.41:6000/rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await rpcResponse.text();

    // Forward status + content type
    res.setHeader(
      "Content-Type",
      rpcResponse.headers.get("content-type") || "application/json"
    );

    return res.status(rpcResponse.status).send(text);
  } catch (error: any) {
    console.error("RPC proxy error:", error);

    return res.status(500).json({
      error: "Proxy error",
      message: error?.message || "Unknown error",
    });
  }
}
