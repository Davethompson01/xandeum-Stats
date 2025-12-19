type JsonRpcResponse<T = any> = {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  } | null;
};

type PodsWithStatsResult = {
  pods: any[];
  total_count: number;
};

// Frontend helper to call the Vercel API route
export default async function getPodsWithStats(
  retries = 2
): Promise<JsonRpcResponse<PodsWithStatsResult>> {
  console.log(`getPodsWithStats: Making request to /api/rpc (${retries} retries remaining)`);
  
  try {
    // Add a timeout on the client side as well (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const res = await fetch("/api/rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "get-pods-with-stats",
          id: 1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("getPodsWithStats: Response status:", res.status);
      console.log("getPodsWithStats: Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        console.error("getPodsWithStats: Request failed:", res.status, errorText);
        
        // If it's a timeout or connection error and we have retries left, retry
        if ((res.status === 504 || res.status === 502) && retries > 0) {
          console.log("getPodsWithStats: Retrying after timeout/connection error...");
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          return getPodsWithStats(retries - 1);
        }
        
        throw new Error(`Failed to fetch pods: ${res.status} ${errorText}`);
      }

      const data = (await res.json()) as JsonRpcResponse<PodsWithStatsResult>;
      console.log("getPodsWithStats: Parsed response data:", data);

      if (data.error) {
        console.error("getPodsWithStats: RPC error in response:", data.error);
        throw new Error(data.error.message || "RPC error occurred");
      }

      return data;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle connection closed errors with retry
      if (
        (fetchError.name === "AbortError" || 
         fetchError.message?.includes("Failed to fetch") ||
         fetchError.message?.includes("ERR_CONNECTION_CLOSED")) &&
        retries > 0
      ) {
        console.log("getPodsWithStats: Connection error, retrying...", fetchError.message);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        return getPodsWithStats(retries - 1);
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error("getPodsWithStats: Exception caught:", error);
    throw error;
  }
}
