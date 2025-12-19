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
export default async function getPodsWithStats(): Promise<JsonRpcResponse<PodsWithStatsResult>> {
  console.log("getPodsWithStats: Making request to /api/rpc");
  
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
    });

    console.log("getPodsWithStats: Response status:", res.status);
    console.log("getPodsWithStats: Response ok:", res.ok);
    console.log("getPodsWithStats: Response headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error("getPodsWithStats: Request failed:", res.status, errorText);
      throw new Error(`Failed to fetch pods: ${res.status} ${errorText}`);
    }

    const data = (await res.json()) as JsonRpcResponse<PodsWithStatsResult>;
    console.log("getPodsWithStats: Parsed response data:", data);

    if (data.error) {
      console.error("getPodsWithStats: RPC error in response:", data.error);
      throw new Error(data.error.message || "RPC error occurred");
    }

    return data;
  } catch (error) {
    console.error("getPodsWithStats: Exception caught:", error);
    throw error;
  }
}
