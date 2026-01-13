// src/pages/admin/Welcome.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WelcomeSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const colorOptions = [
  { value: "from-blue-500 to-cyan-500", label: "Blue to Cyan" },
  { value: "from-purple-500 to-pink-500", label: "Purple to Pink" },
  { value: "from-green-500 to-emerald-500", label: "Green to Emerald" },
  { value: "from-orange-500 to-red-500", label: "Orange to Red" },
  { value: "from-yellow-500 to-orange-500", label: "Yellow to Orange" },
  { value: "from-indigo-500 to-purple-500", label: "Indigo to Purple" },
  { value: "from-pink-500 to-rose-500", label: "Pink to Rose" },
  { value: "from-teal-500 to-cyan-500", label: "Teal to Cyan" },
];

const AdminWelcome = () => {
  const [slides, setSlides] = useState<WelcomeSlide[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<number>(0);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    try {
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
      console.error("Failed to load config:", error);
      toast.error("Failed to load configuration");
    }
  };

  const saveConfig = () => {
    try {
      localStorage.setItem("welcomeScreenConfig", JSON.stringify(slides));
      toast.success("Welcome screen saved successfully!");
    } catch (error) {
      console.error("Failed to save config:", error);
      toast.error("Failed to save configuration");
    }
  };

  const addSlide = () => {
    const newSlide: WelcomeSlide = {
      id: Date.now().toString(),
      title: "New Slide",
      description: "Add your description here",
      icon: "📱",
      color: "from-blue-500 to-cyan-500",
    };
    setSlides([...slides, newSlide]);
    setSelectedSlide(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) {
      toast.error("You must have at least one slide");
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (selectedSlide >= newSlides.length) {
      setSelectedSlide(newSlides.length - 1);
    }
  };

  const updateSlide = (index: number, field: keyof WelcomeSlide, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset to default settings?")) {
      localStorage.removeItem("welcomeScreenConfig");
      loadConfig();
      toast.success("Reset to defaults");
    }
  };

  const resetUserWelcome = () => {
    localStorage.removeItem("hasSeenWelcome");
    toast.success("Users will see the welcome screen again on next visit");
  };

  if (previewMode) {
    const currentSlide = slides[selectedSlide];
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="sm" onClick={() => setPreviewMode(false)}>
            Close Preview
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="flex justify-center">
              <div className={cn(
                "w-32 h-32 rounded-3xl bg-gradient-to-br flex items-center justify-center text-6xl shadow-2xl",
                currentSlide.color
              )}>
                {currentSlide.icon}
              </div>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {currentSlide.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {currentSlide.description}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === selectedSlide
                    ? "w-8 bg-primary"
                    : "w-2 bg-primary/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome Screen</h1>
          <p className="text-sm text-muted-foreground">
            Customize the onboarding experience
          </p>
        </div>
        <Button onClick={addSlide} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={saveConfig}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={() => setPreviewMode(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button variant="outline" onClick={resetToDefaults}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Defaults
        </Button>
        <Button variant="outline" onClick={resetUserWelcome}>
          Reset Users
        </Button>
      </div>

      {/* Slides Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setSelectedSlide(index)}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center text-2xl transition-all",
                  index === selectedSlide
                    ? "ring-2 ring-primary scale-110"
                    : "opacity-50 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "w-full h-full rounded-lg bg-gradient-to-br flex items-center justify-center",
                  slide.color
                )}>
                  {slide.icon}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Slide Editor */}
      {slides[selectedSlide] && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Edit Slide {selectedSlide + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSlide(selectedSlide)}
                disabled={slides.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Icon */}
            <div className="space-y-2">
              <Label>Icon (Emoji)</Label>
              <Input
                value={slides[selectedSlide].icon}
                onChange={(e) => updateSlide(selectedSlide, "icon", e.target.value)}
                placeholder="👋"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Use a single emoji
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={slides[selectedSlide].title}
                onChange={(e) => updateSlide(selectedSlide, "title", e.target.value)}
                placeholder="Welcome to YourApp"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={slides[selectedSlide].description}
                onChange={(e) => updateSlide(selectedSlide, "description", e.target.value)}
                placeholder="Add your description here"
                rows={3}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Gradient Color</Label>
              <Select
                value={slides[selectedSlide].color}
                onValueChange={(value) => updateSlide(selectedSlide, "color", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-4 h-4 rounded bg-gradient-to-r",
                          option.value
                        )} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview Box */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-4xl shadow-lg",
                    slides[selectedSlide].color
                  )}>
                    {slides[selectedSlide].icon}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg">
                    {slides[selectedSlide].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {slides[selectedSlide].description}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="text-muted-foreground">
              💡 <strong>Tip:</strong> The welcome screen will show to new users on their first visit.
            </p>
            <p className="text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Use clear, concise messages and emojis that represent your app's features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWelcome;
