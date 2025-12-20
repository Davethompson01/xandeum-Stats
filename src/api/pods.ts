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
const API_URL =
  typeof window === "undefined"
    ? "https://xandeum-stats-7lnw.vercel.app/api/rpc"
    : "/api/rpc";

// Frontend helper to call the Vercel API route
export default async function getPodsWithStats(
  retries = 2
): Promise<JsonRpcResponse<PodsWithStatsResult>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(API_URL, {
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

    if (!res.ok) {
      const text = await res.text();
      if ((res.status === 502 || res.status === 504) && retries > 0) {
        await new Promise((r) => setTimeout(r, 1500));
        return getPodsWithStats(retries - 1);
      }
      throw new Error(text);
    }

    const data = (await res.json()) as JsonRpcResponse<PodsWithStatsResult>;

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (err: any) {
    if (
      (err.name === "AbortError" || err.message?.includes("fetch")) &&
      retries > 0
    ) {
      await new Promise((r) => setTimeout(r, 2000));
      return getPodsWithStats(retries - 1);
    }
    throw err;
  }
}
