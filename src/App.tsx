import { useState, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { MainWorkspace } from "./components/MainWorkspace";
import { AccountsWorkspace } from "./components/AccountsWorkspace";
import { AICopilot } from "./components/AICopilot";
import { ScenarioComparisonModal } from "./components/ScenarioComparisonModal";

type ViewMode = "optimizer" | "accounts" | string;

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>("optimizer");
  const [estTaxImpact, setEstTaxImpact] = useState<number>(3842);
  const [allocationDrift, setAllocationDrift] = useState<number>(2.4);
  const [afterTaxProceeds, setAfterTaxProceeds] = useState<number>(246158);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    overrideTotal: number;
    lossesHarvested: number;
  } | null>(null);

  const [accountData, setAccountData] = useState<
    { account: string; override: number; tax: number; rec: string }[]
  >([]);

  const handleApplyRecommendation = () => {
    setEstTaxImpact(4321);
    setAllocationDrift(4.8);
    setAfterTaxProceeds(245679);
  };

  const handleOverrideChange = (overrideTotal: number, taxTotal: number) => {
    setIsRecalculating(true);
    setTimeout(() => {
      setEstTaxImpact(taxTotal);
      setAfterTaxProceeds(overrideTotal - taxTotal);
      setIsRecalculating(false);
    }, 1000);
  };

  const handleTableDataChange = useCallback(
    (
      data: { account: string; override: number; tax: number; rec: string }[],
    ) => {
      setAccountData(data);
    },
    [],
  );

  return (
    <>
      <div className="flex h-screen w-full bg-[#f5f6f8] text-gray-900 font-sans overflow-hidden">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <div className="flex-1 flex overflow-hidden">
          {activeView === "accounts" ? (
            <AccountsWorkspace
              onBack={() => setActiveView("optimizer")}
              accountData={accountData}
            />
          ) : (
            <MainWorkspace
              kpis={{ estTaxImpact, allocationDrift, afterTaxProceeds }}
              isRecalculating={isRecalculating}
              onOverrideChange={handleOverrideChange}
              onTableDataChange={handleTableDataChange}
              onOpenModal={(data) => setModalData(data)}
            />
          )}
          <AICopilot onApplyRecommendation={handleApplyRecommendation} />
        </div>
      </div>

      {modalData && (
        <ScenarioComparisonModal
          onClose={() => setModalData(null)}
          kpis={{ estTaxImpact, allocationDrift, afterTaxProceeds }}
          customCash={modalData.overrideTotal}
          lossesHarvested={modalData.lossesHarvested}
        />
      )}
    </>
  );
}
