import React from "react";

interface DependencyListProps {
  dependencies: string[];
  devDependencies: string[];
}

const DependencyList: React.FC<DependencyListProps> = ({
  dependencies,
  devDependencies,
}) => {
  return (
    <div className="bg-neutral-800 rounded-lg p-5 h-[400px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Dependencies List
      </h2>
      <div className="grid grid-cols-2 gap-8">
        {/* Dependencies Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#4f46e5]" />
            <span className="text-white font-medium">Dependencies</span>
          </div>
          <div className="space-y-2">
            {dependencies.map((dep) => (
              <div
                key={dep}
                className="text-neutral-300 text-sm pl-5 py-1 hover:bg-neutral-700/30 rounded transition-colors"
              >
                {dep}
              </div>
            ))}
          </div>
        </div>

        {/* DevDependencies Column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#818cf8]" />
            <span className="text-white font-medium">Dev Dependencies</span>
          </div>
          <div className="space-y-2">
            {devDependencies.map((dep) => (
              <div
                key={dep}
                className="text-neutral-300 text-sm pl-5 py-1 hover:bg-neutral-700/30 rounded transition-colors"
              >
                {dep}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyList;
