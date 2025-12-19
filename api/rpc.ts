export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  console.log("Handler called with method:", req.method);
  console.log("Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Fetching from RPC...");
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

    console.log("RPC response status:", response.status);
    const text = await response.text(); // debug-safe
    console.log("RPC response text:", text);

    if (!response.ok) {
      console.error("RPC error:", text);
      return res.status(500).json({ error: "RPC failed", details: text });
    }

    const data = JSON.parse(text);
    console.log("Parsed data:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Serverless error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
