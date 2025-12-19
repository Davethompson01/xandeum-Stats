type JsonRpcResponse<T = any> = {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
};

async function getPodsWithStats() {
  const res = await fetch("http://161.97.97.41:6000/rpc", {
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
    throw new Error(`HTTP error: ${res.status}`);
  }

  const data = (await res.json()) as JsonRpcResponse;

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result;
}

// usage
getPodsWithStats().then(console.log).catch(console.error);
