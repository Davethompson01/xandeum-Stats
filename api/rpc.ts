export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("http://161.97.97.41:6000/rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "get-pods-with-stats",
        id: 1,
      }),
    });

    const text = await response.text(); // debug-safe

    if (!response.ok) {
      console.error("RPC error:", text);
      return res.status(500).json({ error: "RPC failed", details: text });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Serverless error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
