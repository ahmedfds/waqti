import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    number: number;
    title: string;
    titleAr: string;
  }>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-[#2E86AB] text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-lg font-bold">{step.number}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-600">{step.titleAr}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[#2E86AB] h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;