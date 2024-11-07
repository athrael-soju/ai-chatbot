'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Anvil,
  User,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { Configuration } from './configuration';
import { Knowledgebase } from './knowledgebase';
import { Profile } from './profile';

export default function Component() {
  const router = useRouter();
  const [isConfigurationComplete, setIsConfigurationComplete] = useState(false);
  const [isKnowledgebaseComplete, setIsKnowledgebaseComplete] = useState(false);
  const [isPersonalizationComplete, setIsPersonalizationComplete] =
    useState(false);
  const [progress, setProgress] = useState(0);
  const [showChatButton, setShowChatButton] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [showConfigurationCarousel, setShowConfigurationCarousel] =
    useState(false);
  const [showKnowledgebaseCarousel, setShowKnowledgebaseCarousel] =
    useState(false);
  const [showProfileCustomization, setShowProfileCustomization] =
    useState(false);

  // Setup steps
  const setupSteps = [
    {
      title: 'Configuration',
      icon: Settings,
      route: '/configuration',
      isComplete: isConfigurationComplete,
      disabled: false,
    },
    {
      title: 'Knowledgebase',
      icon: Anvil,
      route: '/knowledgebase',
      isComplete: isKnowledgebaseComplete,
      disabled: !isConfigurationComplete,
    },
    {
      title: 'Profile',
      icon: User,
      route: '/profile',
      isComplete: isPersonalizationComplete,
      disabled: !isKnowledgebaseComplete,
    },
  ];

  useEffect(() => {
    let completedSteps = 0;
    if (isConfigurationComplete) completedSteps++;
    if (isKnowledgebaseComplete) completedSteps++;
    if (isPersonalizationComplete) completedSteps++;

    setProgress((completedSteps / 3) * 100);

    if (completedSteps === 3) {
      setTimeout(() => {
        setShowSteps(false);
        setShowChatButton(true);
      }, 500);
    }
  }, [
    isConfigurationComplete,
    isKnowledgebaseComplete,
    isPersonalizationComplete,
  ]);

  const handleRouteNavigation = (route: string) => {
    if (route === '/configuration') {
      setShowConfigurationCarousel(true);
    } else if (route === '/knowledgebase') {
      setShowKnowledgebaseCarousel(true);
    } else if (route === '/profile') {
      setShowProfileCustomization(true);
    } else {
      router.push(route);
    }
  };

  const handleCloseConfigurationCarousel = () => {
    setShowConfigurationCarousel(false);
    setIsConfigurationComplete(true);
  };

  const handleCloseKnowledgebaseCarousel = () => {
    setShowKnowledgebaseCarousel(false);
    setIsKnowledgebaseComplete(true);
  };

  const handleCloseProfileCustomization = () => {
    setShowProfileCustomization(false);
    setIsPersonalizationComplete(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center sm:text-3xl">
            Welcome to the Forge
          </CardTitle>
          <CardDescription className="text-center">
            Complete the following steps to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-6 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnimatePresence>
              {showSteps &&
                setupSteps.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      variant={item.isComplete ? 'default' : 'outline'}
                      className="w-full h-32 flex flex-col items-center justify-center space-y-2"
                      disabled={item.disabled}
                      onClick={() => handleRouteNavigation(item.route)}
                    >
                      <motion.div
                        initial={false}
                        animate={
                          item.isComplete ? { rotate: 360 } : { rotate: 0 }
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {item.isComplete ? (
                          <CheckCircle style={{ scale: 2 }} />
                        ) : (
                          <item.icon style={{ scale: 2 }} />
                        )}
                      </motion.div>
                      <span className="text-sm font-medium">{item.title}</span>
                    </Button>
                  </motion.div>
                ))}
            </AnimatePresence>

            <AnimatePresence>
              {showChatButton && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="col-span-full w-full"
                >
                  <Link href="/" className="w-full">
                    <Button
                      variant="default"
                      className="w-full h-32 flex flex-col items-center justify-center space-y-2"
                    >
                      <MessageSquare style={{ scale: 2 }} />
                      <span className="text-sm font-medium">
                        Start Chatting
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsConfigurationComplete(true)}
          >
            Simulate Configuration Completion
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsKnowledgebaseComplete(true)}
          >
            Simulate Knowledgebase Completion
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsPersonalizationComplete(true)}
          >
            Simulate Profile Completion
          </Button>
        </CardFooter>
      </Card>

      <AnimatePresence>
        {showConfigurationCarousel && (
          <Configuration onClose={handleCloseConfigurationCarousel} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKnowledgebaseCarousel && (
          <Knowledgebase onClose={handleCloseKnowledgebaseCarousel} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileCustomization && (
          <Profile onClose={handleCloseProfileCustomization} />
        )}
      </AnimatePresence>
    </div>
  );
}
