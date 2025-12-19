export const config = {
  runtime: "nodejs",
  maxDuration: 60, // Maximum execution time in seconds (Pro plan allows up to 300s)
};

export default async function handler(req: Request) {
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
    // Get the request body as text - minimal processing, just forward it
    // This makes it a lightweight proxy like Vite's dev server
    const bodyText = await req.text();
    
    // Forward the request directly to the RPC server
    // This acts like Vite's proxy - minimal overhead, just pass through
    const response = await fetch("http://161.97.97.41:6000/rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
      },
      body: bodyText, // Forward the original body text
    });

    // Get the response as text to forward it
    const responseText = await response.text();
    
    // Return the response with CORS headers
    // This is a true pass-through proxy - we don't parse or modify the response
    return new Response(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "Proxy error",
        message: error?.message || String(error),
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
