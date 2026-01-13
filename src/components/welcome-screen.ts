// src/components/WelcomeScreen.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<WelcomeSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load welcome screen configuration
    const loadConfig = async () => {
      try {
        // Try to get config from storage or use defaults
        const storedConfig = localStorage.getItem("welcomeScreenConfig");
        
        if (storedConfig) {
          setSlides(JSON.parse(storedConfig));
        } else {
          // Default slides
          setSlides([
            {
              id: "1",
              title: "Welcome to YourApp",
              description: "Everything you need in one powerful mobile application",
              icon: "👋",
              color: "from-blue-500 to-cyan-500",
            },
            {
              id: "2",
              title: "Stay Connected",
              description: "Connect with friends and manage your activities seamlessly",
              icon: "🚀",
              color: "from-purple-500 to-pink-500",
            },
            {
              id: "3",
              title: "Secure & Private",
              description: "Your data is encrypted and protected with industry-leading security",
              icon: "🔒",
              color: "from-green-500 to-emerald-500",
            },
            {
              id: "4",
              title: "Get Started",
              description: "Create your account and start exploring amazing features",
              icon: "✨",
              color: "from-orange-500 to-red-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load welcome config:", error);
        // Use defaults on error
        setSlides([
          {
            id: "1",
            title: "Welcome to YourApp",
            description: "Everything you need in one powerful mobile application",
            icon: "👋",
            color: "from-blue-500 to-cyan-500",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (slides.length === 0) {
    handleComplete();
    return null;
  }

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Skip Button */}
      {!isLastSlide && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={cn(
              "w-32 h-32 rounded-3xl bg-gradient-to-br flex items-center justify-center text-6xl shadow-2xl",
              currentSlideData.color
            )}>
              {currentSlideData.icon}
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {currentSlideData.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentSlideData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 space-y-6">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30"
              )}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            className={cn("flex-1", currentSlide === 0 && "w-full")}
          >
            {isLastSlide ? "Get Started" : "Next"}
            {!isLastSlide && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;