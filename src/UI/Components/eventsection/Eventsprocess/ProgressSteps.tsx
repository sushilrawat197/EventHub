import React from "react";
import { FaChevronRight } from "react-icons/fa";

type stepsData = {
  id: number;
  label: string;
};

interface ProgressStepsProps {
  steps: stepsData[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export default function ProgressSteps({
  steps,
  currentStep,
  onStepClick,
}: ProgressStepsProps) {
  return (
    <div className="w-full  overflow-x-auto scrollbar-hide">
      <div
        className="
          flex items-center justify-center  text-sm p-4 border-b border-gray-200 shadow 
          min-w-max md:min-w-0 
          md:space-x-0 space-x-2
        "
      >
        <div className="flex items-center justify-center gap-2">

          {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center space-x-2 ">
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                  ${isActive ? "bg-black text-white" : ""}
                  ${isCompleted ? "bg-sky-500 text-white" : ""}
                  ${!isActive && !isCompleted ? "bg-gray-300 text-gray-700" : ""}
                  ${isCompleted ? "cursor-pointer hover:bg-sky-600" : ""}
                `}
                  onClick={() => {
                    if (isCompleted && onStepClick) onStepClick(step.id);
                  }}
                >
                  {step.id}
                </span>
                <span
                  className={`whitespace-nowrap
                    ${isActive
                      ? "text-black font-medium"
                      : isCompleted
                      ? "text-sky-500 font-medium cursor-pointer"
                      : "text-gray-500"
                    }`}
                  onClick={() => {
                    if (isCompleted && onStepClick) onStepClick(step.id);
                  }}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <FaChevronRight className="text-gray-400 flex-shrink-0 " />
              )}
            </React.Fragment>
          );
        })}

        </div>
        
      </div>
    </div>
  );
}
