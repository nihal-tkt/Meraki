import React from "react";
import { features } from "../constants";


const FeatureSection = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-800 ">
      <div className="text-center">
      
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
          What's{" "}
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            New 
          </span>
        </h2>
      </div>
      <div className="flex flex-wrap mt-20 pb-20 lg:mt-20">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-6">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 p-2 bg-neutral-900 text-orange-700 justify-center items-center rounded-full">
                {feature.icon}
              </div>
              <div>
                <h5 className="text-xl font-semibold text-neutral-200">
                  {feature.text}
                </h5>
                <p className="text-md text-neutral-500 mt-2">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
