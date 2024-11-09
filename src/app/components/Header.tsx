import React from "react";

function Header() {
  return (
    <div className="relative">
      <div className="hidden sm:block absolute -left-8 top-0 text-gray-300 text-4xl sm:text-6xl opacity-50">
        🔍
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
            Why Await
          </h1>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-emerald-400 font-mono transform -rotate-3">
            TWICE
          </span>
        </div>

        <div className="w-16 sm:w-24 h-1 bg-emerald-400 transform -rotate-3"></div>

        {/* Subflair text - smaller on mobile */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-light italic pl-1 sm:pl-2">
          async adventures
        </p>
      </div>

      {/* Corner decorator - adjusted position for mobile */}
      <div className="absolute -right-2 sm:-right-4 top-0 text-emerald-400 text-2xl sm:text-4xl transform rotate-12">
        →
      </div>
    </div>
  );
}

export default Header;
