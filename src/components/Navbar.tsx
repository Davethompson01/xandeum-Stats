import { useState } from "react";
import xandeumLogo from "../assets/xandeum.svg";
import search from "../assets/search.svg";
import FAQ from "../assets/FAQ.svg";
import overview from "../assets/overview.svg";

const NavBar = () => {
  const [openModel, setOpenModel] = useState(false);

  return (
    <div className="relative w-full bg-[#111317] text-[#fdfdfd]">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen bg-[#1b1e24]
          transition-transform duration-300 ease-in-out

          w-[80%] sm:w-[60%] md:w-[30%] lg:w-[15%]

          ${openModel ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center gap-3 px-6 py-4">
          <img src={xandeumLogo} alt="Xandeum" className="h-[40px]" />
        </div>

        <nav className="mt-8 px-6">
          <ul className="space-y-5">
            <li className="flex items-center gap-3 cursor-pointer hover:text-green-400">
              <img src={overview} alt="" className="h-5" />
              Overview
            </li>
            <li className="cursor-pointer hover:text-green-400">Nodes List</li>
            <li className="cursor-pointer hover:text-green-400">Map</li>
            <li className="cursor-pointer hover:text-green-400">Alert Views</li>
          </ul>
        </nav>
      </aside>

      {/* ================= TOP NAV ================= */}
      <header
        className="
          flex items-center justify-between py-3
          px-4 sm:px-6 md:px-8
          lg:ml-[15%]
        "
      >
        {/* Toggle button (hidden on desktop) */}
        <button
          onClick={() => setOpenModel((prev) => !prev)}
          className="lg:hidden flex items-center"
        >
          <img src={xandeumLogo} alt="Xandeum" className="h-[28px]" />
        </button>

        {/* Dashboard Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="hidden md:block text-[18px] font-normal">
            Dashboard overview
          </h1>

          <div className="flex items-center gap-2 rounded-full border-2 border-[#14412a] bg-[#11251f] px-3 py-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#21c55e]" />
            <span className="text-[#21c55e] text-sm">Network Stable</span>
          </div>
        </div>

        {/* Search (hidden on very small screens) */}
        <div className="hidden sm:flex items-center gap-2 bg-[#282e39] px-3 py-1 rounded">
          <img src={search} alt="" className="h-5" />
          <input
            type="text"
            placeholder="Search Pnodes or IP address"
            className="bg-transparent text-sm outline-none placeholder:text-gray-400 w-[160px] md:w-[220px]"
          />
          <img src={FAQ} alt="" className="h-5 cursor-pointer" />
        </div>
      </header>

      {/* ================= OVERLAY (mobile/tablet only) ================= */}
      {openModel && (
        <div
          onClick={() => setOpenModel(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
    </div>
  );
};

export default NavBar;
