// StepForm.tsx

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Controller, UseFormReturn } from 'react-hook-form';

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

import { steps } from './steps';
import { ConfigurationFormData } from './validation';

interface StepFormProps {
  currentStep: number;
  formMethods: UseFormReturn<ConfigurationFormData>;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export const StepForm = ({
  currentStep,
  formMethods,
  handleNextStep,
  handlePreviousStep,
}: StepFormProps) => {
  const { control, formState } = formMethods;
  return (
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
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(steps[currentStep].options).map(([key, options]) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <Controller
                name={key as keyof ConfigurationFormData}
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value || ''}
                  >
                    <SelectTrigger id={key}>
                      <SelectValue placeholder={`Select ${key}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(options as string[]).map((option: string) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formState.errors[key as keyof ConfigurationFormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    formState.errors[key as keyof ConfigurationFormData]
                      ?.message
                  }
                </p>
              )}
            </div>
          ))}
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
          <Button onClick={handleNextStep}>
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
  );
};
