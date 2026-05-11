import BottomNav from "@/components/zora/BottomNav";
import DashboardFacade from "@/components/zora/DashboardFacade";
import EmergencyAlert from "@/components/zora/EmergencyAlert";
import HabitsScreen from "@/components/zora/HabitsScreen";
import HistoryScreen from "@/components/zora/HistoryScreen";
import ProfileFacade from "@/components/zora/ProfileFacade";
import SecureMode from "@/components/zora/SecureMode";
import { ZoraProvider, useZora } from "@/contexts/ZoraContext";
import { AnimatePresence } from "framer-motion";

const ZoraApp = () => {
  const { mode, facadeTab } = useZora();

  if (mode === "alert") return <EmergencyAlert />;
  if (mode === "secure") return <SecureMode />;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {facadeTab === "home" && <DashboardFacade key="home" />}
        {facadeTab === "calendar" && <HistoryScreen key="calendar" />}
        {facadeTab === "habits" && <HabitsScreen key="habits" />}
        {facadeTab === "profile" && <ProfileFacade key="profile" />}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

const Index = () => (
  <ZoraProvider>
    <ZoraApp />
  </ZoraProvider>
);

export default Index;
