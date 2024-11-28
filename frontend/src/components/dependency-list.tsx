import React, { useState } from "react";

interface DependencyListProps {
  dependencies: string[];
  devDependencies: string[];
}

const DependencyList: React.FC<DependencyListProps> = ({
  dependencies,
  devDependencies,
}) => {
  const [openSection, setOpenSection] = useState<"deps" | "devDeps" | null>(
    "deps"
  );

  const toggleSection = (section: "deps" | "devDeps") => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-5 h-[400px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Dependencies List
      </h2>

      {/* Dependencies Accordion */}
      <div className="space-y-3">
        <div className="border border-neutral-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("deps")}
            className="w-full flex items-center gap-2 p-3 hover:bg-neutral-700/30 transition-colors"
          >
            <div className="w-3 h-3 rounded-full bg-[#4f46e5]" />
            <span className="text-white font-medium">Dependencies</span>
            <span className="ml-auto text-neutral-400">
              {openSection === "deps" ? "−" : "+"}
            </span>
          </button>

          {openSection === "deps" && (
            <div className="space-y-2 p-3 pt-0">
              {dependencies.map((dep) => (
                <div
                  key={dep}
                  className="text-neutral-300 text-sm pl-5 py-1 hover:bg-neutral-700/30 rounded transition-colors"
                >
                  {dep}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DevDependencies Accordion */}
        <div className="border border-neutral-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("devDeps")}
            className="w-full flex items-center gap-2 p-3 hover:bg-neutral-700/30 transition-colors"
          >
            <div className="w-3 h-3 rounded-full bg-[#818cf8]" />
            <span className="text-white font-medium">Dev Dependencies</span>
            <span className="ml-auto text-neutral-400">
              {openSection === "devDeps" ? "−" : "+"}
            </span>
          </button>

          {openSection === "devDeps" && (
            <div className="space-y-2 p-3 pt-0">
              {devDependencies.map((dep) => (
                <div
                  key={dep}
                  className="text-neutral-300 text-sm pl-5 py-1 hover:bg-neutral-700/30 rounded transition-colors"
                >
                  {dep}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DependencyList;
