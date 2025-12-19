import { useEffect, useState } from "react";
import getPodsWithStats from "../../api/pods";

const HeroSection = () => {
  const [totalPods, setTotalPods] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPodsWithStats()
      .then((res) => {
        // Access the nested result from your API
        setTotalPods(res.result?.total_count || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="bg-[#101622] border-[0.5px] border-[#ccc] text-white px-4 sm:px-6 md:px-8 pt-4">
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {/* Total Active pNodes */}
        <div className="bg-[#111317] w-[150px] sm:w-[180px] md:w-[200px] h-[100px] rounded-[10px] border-[#ccc] border-[0.5px] flex flex-col justify-center items-center">
          <p>Total Active pNodes</p>
          <h1 className="text-2xl font-semibold">
            {loading ? "—" : totalPods}
          </h1>
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
