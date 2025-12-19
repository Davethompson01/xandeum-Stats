const getPodsWithStats = async () => {
  const res = await fetch("/api/rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "get-pods-with-stats",
      id: 1,
    }),
  });
  if (!res.ok) throw new Error("Failed to fetch pods");
  return res.json();
};

export default getPodsWithStats;
