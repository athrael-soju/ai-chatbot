// Stepper.tsx

import { motion } from 'framer-motion';

import { steps } from './steps';

interface StepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isStepComplete: (step: number) => boolean;
}

export const Stepper = ({
  currentStep,
  setCurrentStep,
  isStepComplete,
}: StepperProps) => {
  return (
    <div className="flex justify-center mb-8">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        return (
          <div key={index} className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full p-2 transition-colors duration-200 ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : isStepComplete(index)
                    ? 'bg-primary/50 text-primary-foreground/50'
                    : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <StepIcon className="size-6" />
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '2rem' }}
                transition={{ duration: 0.3 }}
                className={`h-1 transition-colors duration-200 ${
                  isStepComplete(index) ? 'bg-primary/50' : 'bg-secondary'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
