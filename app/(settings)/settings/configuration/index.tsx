'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  FileText,
  Settings,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const steps = [
  {
    title: 'Set up your providers',
    description:
      'Configure processing/chunking, vector DB, reranking, and embedding',
    icon: Database,
    options: {
      processing: ['Option 1', 'Option 2', 'Option 3'],
      vectorDB: ['Option A', 'Option B', 'Option C'],
      reranking: ['Choice 1', 'Choice 2', 'Choice 3'],
      embedding: ['Type 1', 'Type 2', 'Type 3'],
    },
  },
  {
    title: 'Configure your processing settings',
    description: 'Set up the processing parameters for your pipeline',
    icon: FileText,
    options: {
      parameter1: ['Low', 'Medium', 'High'],
      parameter2: ['Fast', 'Balanced', 'Thorough'],
    },
  },
  {
    title: 'Configure your chunking settings',
    description: 'Set up the chunking parameters for your pipeline',
    icon: Settings,
    options: {
      chunkSize: ['Small', 'Medium', 'Large'],
      overlap: ['None', 'Minimal', 'Moderate', 'Significant'],
    },
  },
  {
    title: 'Configure your retrieval settings',
    description: 'Set up the retrieval parameters for your pipeline',
    icon: Zap,
    options: {
      method: ['BM25', 'TF-IDF', 'Semantic'],
      topK: ['5', '10', '20', '50'],
    },
  },
];

interface ConfigurationCarouselProps {
  onClose: () => void;
}

export function Configuration({ onClose }: ConfigurationCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepSelections, setStepSelections] = useState<
    Record<string, Record<string, string>>
  >({});
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);

  useEffect(() => {
    // Initialize stepSelections with empty objects for each step
    setStepSelections(
      steps.reduce(
        (acc, _, index) => {
          acc[index] = {};
          return acc;
        },
        {} as Record<string, Record<string, string>>
      )
    );
  }, []);

  const handleSelection = (step: number, key: string, value: string) => {
    setStepSelections((prev) => ({
      ...prev,
      [step]: { ...prev[step], [key]: value },
    }));
  };

  const isStepComplete = (step: number) => {
    const selections = stepSelections[step] || {};
    return Object.keys(steps[step].options).every((key) => selections[key]);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps((prev) => [...new Set([...prev, nextStep])]);
    } else if (isStepComplete(currentStep)) {
      setIsSetupCompleted(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{steps[currentStep].title}</CardTitle>
                  <CardDescription>
                    {steps[currentStep].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(steps[currentStep].options).map(
                    ([key, options]) => (
                      <div key={key}>
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium mb-1"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <Select
                          onValueChange={(value) =>
                            handleSelection(currentStep, key, value)
                          }
                          value={stepSelections[currentStep]?.[key] || ''}
                        >
                          <SelectTrigger id={key}>
                            <SelectValue placeholder={`Select ${key}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                    variant="outline"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!isStepComplete(currentStep)}
                  >
                    {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                    {currentStep === steps.length - 1 ? (
                      <Check className="ml-2 size-4" />
                    ) : (
                      <ArrowRight className="ml-2 size-4" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
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
