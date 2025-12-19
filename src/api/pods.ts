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

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Failed to fetch pods: ${res.status} ${errorText}`);
  }

  const data = (await res.json()) as JsonRpcResponse<PodsWithStatsResult>;

  if (data.error) {
    throw new Error(data.error.message || "RPC error occurred");
  }

  return data;
}
