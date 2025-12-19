export const config = {
  runtime: "nodejs",
  maxDuration: 60, // Maximum execution time in seconds (Pro plan allows up to 300s)
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
    const startTime = Date.now();
    
    // Create an AbortController for timeout handling
    // Set timeout to 25 seconds to allow for slow RPC responses
    // but still fail before Vercel's execution limit kills us
    // Vercel Hobby: 10s limit, Pro: 60s limit (we set maxDuration to 60 in config)
    const timeoutMs = 25000; // 25 seconds - allows slow RPC but fails before Vercel kills us
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch("http://161.97.97.41:6000/rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "get-pods-with-stats",
          id: 1,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const elapsedTime = Date.now() - startTime;
      console.log(`RPC fetch completed in ${elapsedTime}ms`);

      console.log("RPC response status:", response.status);
      const text = await response.text(); // debug-safe
      console.log("RPC response text length:", text.length);

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
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      const elapsedTime = Date.now() - startTime;
      
      if (fetchError.name === "AbortError") {
        console.error(`RPC request timed out after ${elapsedTime}ms`);
        return new Response(
          JSON.stringify({
            error: "Request timeout",
            message: "The RPC server took too long to respond. Please try again.",
            elapsedTime,
          }),
          {
            status: 504,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
      
      console.error("Fetch error:", fetchError);
      throw fetchError; // Re-throw to be caught by outer catch
    }
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
