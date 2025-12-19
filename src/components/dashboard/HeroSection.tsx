import { useEffect, useState } from "react";
import getPodsWithStats from "../../api/pods";

const HeroSection = () => {
  const [totalPods, setTotalPods] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("HeroSection: Starting to fetch pods...");
    const startTime = Date.now();
    
    getPodsWithStats()
      .then((res) => {
        const elapsedTime = Date.now() - startTime;
        console.log(`HeroSection: API Response received after ${elapsedTime}ms:`, res);
        console.log("HeroSection: Result:", res.result);
        console.log("HeroSection: Total count:", res.result?.total_count);
        // Access the nested result from your API
        const count = res.result?.total_count ?? 0;
        console.log("HeroSection: Setting totalPods to:", count);
        setTotalPods(count);
        setError(null);
      })
      .catch((error) => {
        const elapsedTime = Date.now() - startTime;
        console.error(`HeroSection: Error fetching pods after ${elapsedTime}ms:`, error);
        console.error("HeroSection: Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        
        // Set error message for different error types
        if (error.message?.includes("timeout") || error.message?.includes("504")) {
          setError("Request timed out. The server is taking longer than expected.");
        } else if (error.message?.includes("Failed to fetch") || error.message?.includes("ERR_CONNECTION_CLOSED")) {
          setError("Connection closed. The request took too long. Retrying...");
        } else {
          setError("Failed to load data. Please try again.");
        }
        
        // Set to 0 on error so it doesn't show loading forever
        setTotalPods(0);
      })
      .finally(() => {
        console.log("HeroSection: Request completed, setting loading to false");
        setLoading(false);
      });
  }, []);


  return (
    <div className="bg-[#101622] border-[0.5px] border-[#ccc] text-white px-4 sm:px-6 md:px-8 pt-4">
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {/* Total Active pNodes */}
        <div className="bg-[#111317] w-[150px] sm:w-[180px] md:w-[200px] h-[100px] rounded-[10px] border-[#ccc] border-[0.5px] flex flex-col justify-center items-center">
          <p>Total Active pNodes</p>
          <h1 className="text-2xl font-semibold">
            {loading ? (
              <span className="inline-flex items-center">
                <span className="animate-pulse">—</span>
              </span>
            ) : error ? (
              <span className="text-red-400 text-sm" title={error}>Error</span>
            ) : (
              totalPods ?? "—"
            )}
          </h1>
          {loading && (
            <p className="text-xs text-gray-400 mt-1">Loading...</p>
          )}
        </div>
        


        {/* Top Country */}
        <div className="bg-[#111317] w-[150px] sm:w-[180px] md:w-[200px] h-[100px] rounded-[10px] border-[#ccc] border-[0.5px] flex flex-col justify-center items-center">
          <p>Top Country</p>
          <h1>France</h1>
        </div>

        {/* Top Version */}
        <div className="bg-[#111317] w-[150px] sm:w-[180px] md:w-[200px] h-[100px] rounded-[10px] border-[#ccc] border-[0.5px] flex flex-col justify-center items-center">
          <p>Top Version</p>
          <h1>0.8.0</h1>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
