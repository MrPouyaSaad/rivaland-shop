import React from "react";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: "cart", label: "سبد خرید" },
    { id: "shipping", label: "اطلاعات ارسال" },
    { id: "payment", label: "پرداخت" },
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="border-b border-gray-100 py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          
          {/* Progress Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-100 -translate-y-1/2">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                {/* Step Circle */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  border-2 transition-all duration-300
                  ${isCompleted 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : isCurrent 
                    ? "bg-white border-blue-600 text-blue-600 shadow-sm" 
                    : "bg-white border-gray-200 text-gray-400"
                  }
                `}>
                  {index + 1}
                </div>

                {/* Step Label */}
                <div className={`
                  mt-3 text-xs font-medium whitespace-nowrap
                  ${isCompleted 
                    ? "text-blue-600" 
                    : isCurrent 
                    ? "text-blue-600 font-semibold" 
                    : "text-gray-500"
                  }
                `}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;