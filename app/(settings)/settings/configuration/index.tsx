// Configuration.tsx

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { StepForm } from './step-form';
import { Stepper } from './stepper';
import { steps } from './steps';
import { configurationSchema, ConfigurationFormData } from './validation';

interface ConfigurationCarouselProps {
  onClose: () => void;
}

export function Configuration({ onClose }: ConfigurationCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);

  const formMethods = useForm<ConfigurationFormData>({
    resolver: zodResolver(configurationSchema),
    mode: 'onChange',
  });

  const { getValues, trigger } = formMethods;

  const handleNextStep = async () => {
    const fields = Object.keys(steps[currentStep].options) as Array<
      keyof ConfigurationFormData
    >;
    const isValid = await trigger(fields);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setVisitedSteps((prev) => [...new Set([...prev, nextStep])]);
      } else {
        setIsSetupCompleted(true);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (step: number) => {
    const fields = Object.keys(steps[step].options) as Array<
      keyof ConfigurationFormData
    >;
    const values = getValues();
    return fields.every((key) => values[key]);
  };

  const allStepsCompleted = steps.every((_, index) => isStepComplete(index));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Configuration Setup
          </CardTitle>
          <CardDescription className="text-center">
            Complete the following steps to configure your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper
            currentStep={currentStep}
            setCurrentStep={(step) => {
              setCurrentStep(step);
              setVisitedSteps((prev) => [...new Set([...prev, step])]);
            }}
            isStepComplete={isStepComplete}
          />
          <AnimatePresence mode="wait">
            <StepForm
              key={currentStep}
              currentStep={currentStep}
              formMethods={formMethods}
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
            />
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-center">
          {isSetupCompleted && allStepsCompleted && (
            <Button onClick={onClose} className="w-full">
              Finish Configuration
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
