import React, { createContext, useCallback, useContext, useState } from "react";

type ZoraMode = "facade" | "secure" | "alert";
type FacadeTab = "home" | "calendar" | "habits" | "profile";

interface ZoraContextType {
  mode: ZoraMode;
  facadeTab: FacadeTab;
  setFacadeTab: (tab: FacadeTab) => void;
  enterSecureMode: () => void;
  exitSecureMode: () => void;
  triggerAlert: () => void;
  cancelAlert: () => void;
  userName: string;
}

const ZoraContext = createContext<ZoraContextType | null>(null);

export const useZora = () => {
  const ctx = useContext(ZoraContext);
  if (!ctx) throw new Error("useZora must be used within ZoraProvider");
  return ctx;
};

export const ZoraProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ZoraMode>("facade");
  const [facadeTab, setFacadeTab] = useState<FacadeTab>("home");

  const enterSecureMode = useCallback(() => setMode("secure"), []);
  const exitSecureMode = useCallback(() => {
    setMode("facade");
    setFacadeTab("home");
  }, []);
  const triggerAlert = useCallback(() => setMode("alert"), []);
  const cancelAlert = useCallback(() => setMode("secure"), []);

  return (
    <ZoraContext.Provider
      value={{
        mode,
        facadeTab,
        setFacadeTab,
        enterSecureMode,
        exitSecureMode,
        triggerAlert,
        cancelAlert,
        userName: "Maria",
      }}
    >
      {children}
    </ZoraContext.Provider>
  );
};
