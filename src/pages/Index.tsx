import { useState } from "react";
import { BottomNav } from "@/components/ui/BottomNav";
import { HomeTab } from "@/components/tabs/HomeTab";
import { WorksTab } from "@/components/tabs/WorksTab";
import { AboutTab } from "@/components/tabs/AboutTab";
import { ContactTab } from "@/components/tabs/ContactTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleViewProject = (projectId: string) => {
    console.log("View project:", projectId);
    setActiveTab("works");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-5 py-6 pb-28 safe-top">
        {activeTab === "home" && <HomeTab onViewProject={handleViewProject} />}
        {activeTab === "works" && <WorksTab onViewProject={handleViewProject} />}
        {activeTab === "about" && <AboutTab />}
        {activeTab === "contact" && <ContactTab />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
