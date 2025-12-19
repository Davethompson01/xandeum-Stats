export const config = {
  runtime: "nodejs",
};

export default async function handler(req: Request) {
  console.log("Handler called with method:", req.method);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    // Parse request body if needed (though we're not using it in this case)
    const body = await req.json().catch(() => ({}));
    console.log("Request body:", body);

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
      return new Response(
        JSON.stringify({ error: "RPC failed", details: text }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const data = JSON.parse(text);
    console.log("Parsed data:", data);
    console.log("Data result:", data.result);
    console.log("Total count:", data.result?.total_count);
    
    // Ensure we're returning the full JSON-RPC response structure
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Serverless error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error?.message || String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
