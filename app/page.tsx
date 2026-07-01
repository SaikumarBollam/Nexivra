import Feed from "@/components/Feed";
import News from "@/components/News";
import Sidebar from "@/components/Sidebar";
import DirectoryTab from "@/components/DirectoryTab";
import JobsTab from "@/components/JobsTab";
import MentorshipTab from "@/components/MentorshipTab";
import EventsTab from "@/components/EventsTab";
import StartupTab from "@/components/StartupTab";
import AICoachTab from "@/components/AICoachTab";
import PerformanceTab from "@/components/PerformanceTab";
import { currentUser } from "@/lib/mock-clerk-server";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: PageProps) {
  const user = await currentUser();
  const activeTab = (searchParams?.tab as string) || "home";
   
  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 px-4">
        {/* Sidebar Left Column */}
        <div className="w-full md:w-[22%] flex-shrink-0">
          <Sidebar user={user} />
        </div>

        {/* Dynamic Center/Right Columns */}
        <div className="flex-1 min-w-0">
          {activeTab === "home" && (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <Feed user={user} />
              </div>
              <div className="w-full lg:w-[32%] flex-shrink-0">
                <News />
              </div>
            </div>
          )}

          {activeTab === "directory" && <DirectoryTab />}
          {activeTab === "jobs" && <JobsTab />}
          {activeTab === "mentorship" && <MentorshipTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "startup" && <StartupTab />}
          {activeTab === "ai-coach" && <AICoachTab />}
          {activeTab === "performance" && <PerformanceTab />}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
