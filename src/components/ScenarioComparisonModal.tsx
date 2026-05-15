import { useState } from "react";
import { X, MoreVertical, Plus, Check } from "lucide-react";

interface ScenarioComparisonModalProps {
  onClose: () => void;
  kpis: {
    estTaxImpact: number;
    allocationDrift: number;
    afterTaxProceeds: number;
  };
  customCash: number;
  lossesHarvested: number;
}

export function ScenarioComparisonModal({
  onClose,
  kpis,
  customCash,
  lossesHarvested,
}: ScenarioComparisonModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const scaleRatio = customCash > 0 ? customCash / 250000 : 0;

  const scenarios = [
    {
      id: 0,
      name: "System Recommended",
      taxImpact: kpis.estTaxImpact,
      drift: kpis.allocationDrift,
      proceeds: customCash - kpis.estTaxImpact,
      cash: customCash,
      ltGains: 78300 * scaleRatio,
      stGains: 12400 * scaleRatio,
      losses: -lossesHarvested,
      accounts: "5 of 7",
      chartColor: "#6B46C1", // Purple
      chartTheme: "purple",
    },
    {
      id: 1,
      name: "Minimize Tax",
      taxImpact: 4321 * scaleRatio,
      drift: 4.8,
      proceeds: customCash - 4321 * scaleRatio,
      cash: customCash,
      ltGains: 18200 * scaleRatio,
      stGains: 3100 * scaleRatio,
      losses: -42000 * scaleRatio,
      accounts: "6 of 7",
      chartColor: "#F97316", // Orange
      chartTheme: "orange",
    },
    {
      id: 2,
      name: "Maintain Allocation",
      taxImpact: 18765 * scaleRatio,
      drift: 0.6,
      proceeds: customCash - 18765 * scaleRatio,
      cash: customCash,
      ltGains: 142250 * scaleRatio,
      stGains: 18900 * scaleRatio,
      losses: -5000 * scaleRatio,
      accounts: "3 of 7",
      chartColor: "#14B8A6", // Teal
      chartTheme: "teal",
    },
  ];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--cibc-bg-dark)]/50 backdrop-blur-sm">
      <div className="bg-[var(--cibc-bg-primary)] w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-5 border-b border-[var(--cibc-border-primary)] flex justify-between items-center bg-[var(--cibc-bg-secondary)]/50">
          <div>
            <h2 className="text-2xl font-bold text-[var(--cibc-text-primary)]">
              Scenario Comparison
            </h2>
            <p className="text-sm text-[var(--cibc-text-secondary)] mt-1">
              Compare different strategies side by side
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="cibc-btn-secondary">
              <Plus className="w-4 h-4 mr-2" /> New Scenario
            </button>
            <button className="text-[var(--cibc-text-secondary)] hover:text-[var(--cibc-text-primary)] transition-colors p-2">
              <MoreVertical className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[var(--cibc-border-primary)]"></div>
            <button
              onClick={onClose}
              className="text-[var(--cibc-text-secondary)] hover:text-[var(--cibc-text-primary)] transition-colors p-2 rounded-full hover:bg-[var(--cibc-border-primary)]/30"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Scenario Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {scenarios.map((scenario) => {
              const isSelected = selectedScenario === scenario.id;
              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--cibc-burgundy)] bg-[var(--cibc-bg-secondary)] shadow-md"
                      : "border-[var(--cibc-border-primary)] hover:border-[var(--cibc-border-secondary)] bg-[var(--cibc-bg-primary)] shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-[var(--cibc-burgundy)] text-[var(--cibc-text-reverse)] px-3 py-1 rounded-bl-lg rounded-tr-lg text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </div>
                  )}
                  <h3 className="font-bold text-[var(--cibc-text-primary)] mb-4">
                    {scenario.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-[var(--cibc-text-secondary)] font-medium">
                        Est. Tax Impact
                      </span>
                      <span className="text-sm font-bold text-[var(--cibc-text-primary)]">
                        {formatCurrency(scenario.taxImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-[var(--cibc-text-secondary)] font-medium">
                        Allocation Drift
                      </span>
                      <span className="text-sm font-bold text-[var(--cibc-text-primary)]">
                        {scenario.drift}%
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-[var(--cibc-text-secondary)] font-medium">
                        After-Tax Proceeds
                      </span>
                      <span className="text-sm font-bold text-[var(--cibc-text-primary)]">
                        {formatCurrency(scenario.proceeds)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison Data Table */}
          <div className="border border-[var(--cibc-border-primary)] rounded-xl overflow-hidden mb-8 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--cibc-bg-secondary)] text-[var(--cibc-text-secondary)] text-xs uppercase font-bold border-b border-[var(--cibc-border-primary)]">
                <tr>
                  <th className="py-4 px-6 border-r border-[var(--cibc-border-primary)] w-1/4">
                    Metric
                  </th>
                  {scenarios.map((s) => (
                    <th
                      key={s.id}
                      className={`py-4 px-6 w-1/4 text-center border-r last:border-0 border-[var(--cibc-border-primary)] ${selectedScenario === s.id ? "bg-[var(--cibc-bg-error)] text-[var(--cibc-burgundy)]" : ""}`}
                    >
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cibc-border-primary)]">
                {[
                  {
                    label: "Cash Provided",
                    key: "cash",
                    format: formatCurrency,
                  },
                  {
                    label: "Estimated Tax Impact",
                    key: "taxImpact",
                    format: formatCurrency,
                  },
                  {
                    label: "After-Tax Proceeds",
                    key: "proceeds",
                    format: formatCurrency,
                  },
                  {
                    label: "Allocation Drift (Avg)",
                    key: "drift",
                    format: (v: number) => `${v}%`,
                  },
                  {
                    label: "Long Term Gains Realized",
                    key: "ltGains",
                    format: formatCurrency,
                  },
                  {
                    label: "Short Term Gains Realized",
                    key: "stGains",
                    format: formatCurrency,
                  },
                  {
                    label: "Losses Harvested",
                    key: "losses",
                    format: formatCurrency,
                  },
                  {
                    label: "Accounts Used",
                    key: "accounts",
                    format: (v: string) => v,
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[var(--cibc-bg-secondary)]/50 transition-colors"
                  >
                    <td className="py-3 px-6 border-r border-[var(--cibc-border-primary)] font-medium text-[var(--cibc-text-secondary)] bg-[var(--cibc-bg-secondary)]/30">
                      {row.label}
                    </td>
                    {scenarios.map((s) => (
                      <td
                        key={s.id}
                        className={`py-3 px-6 text-center border-r border-[var(--cibc-border-primary)] last:border-0 font-medium ${selectedScenario === s.id ? "bg-[var(--cibc-bg-error)]/50 text-[var(--cibc-burgundy)]" : "text-[var(--cibc-text-primary)]"}`}
                      >
                        {/* @ts-ignore */}
                        {row.format(s[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual Analytics Section */}
          <div className="bg-[var(--cibc-bg-secondary)] border border-[var(--cibc-border-primary)] rounded-xl p-6">
            <h3 className="text-sm font-bold text-[var(--cibc-text-primary)] mb-2">
              Visual Allocation Drift
            </h3>

            <div className="grid grid-cols-3 gap-6 mb-4">
              {/* Chart 1: Moderate Spread (System Recommended) */}
              <div className="border border-[var(--cibc-border-primary)] bg-[var(--cibc-bg-primary)] rounded-lg p-4 flex flex-col justify-end h-40 relative">
                <div className="flex justify-around items-end h-full w-full px-2 gap-2 pb-6">
                  <div className="w-1/3 bg-[var(--cibc-burgundy-tint)] h-[30%] rounded-t-sm"></div>
                  <div className="w-1/3 bg-[var(--cibc-burgundy)] h-[90%] rounded-t-sm"></div>
                  <div className="w-1/3 bg-[var(--cibc-burgundy-dark)] h-[40%] rounded-t-sm"></div>
                </div>
                <div className="flex justify-around text-[10px] font-bold text-[var(--cibc-text-secondary)] absolute bottom-2 w-full left-0 px-6">
                  <span>Under</span>
                  <span>In Target</span>
                  <span>Over</span>
                </div>
              </div>

              {/* Chart 2: Heavy Skew (Minimize Tax) */}
              <div className="border border-[var(--cibc-border-primary)] bg-[var(--cibc-bg-primary)] rounded-lg p-4 flex flex-col justify-end h-40 relative">
                <div className="flex justify-around items-end h-full w-full px-2 gap-2 pb-6">
                  <div className="w-1/3 bg-orange-400 h-[60%] rounded-t-sm"></div>
                  <div className="w-1/3 bg-orange-200 h-[20%] rounded-t-sm"></div>
                  <div className="w-1/3 bg-orange-600 h-[80%] rounded-t-sm"></div>
                </div>
                <div className="flex justify-around text-[10px] font-bold text-[var(--cibc-text-secondary)] absolute bottom-2 w-full left-0 px-6">
                  <span>Under</span>
                  <span>In Target</span>
                  <span>Over</span>
                </div>
              </div>

              {/* Chart 3: Tight Cluster (Maintain Allocation) */}
              <div className="border border-[var(--cibc-border-primary)] bg-[var(--cibc-bg-primary)] rounded-lg p-4 flex flex-col justify-end h-40 relative">
                <div className="flex justify-around items-end h-full w-full px-2 gap-2 pb-6">
                  <div className="w-1/3 bg-teal-200 h-[10%] rounded-t-sm"></div>
                  <div className="w-1/3 bg-teal-500 h-[95%] rounded-t-sm"></div>
                  <div className="w-1/3 bg-teal-200 h-[15%] rounded-t-sm"></div>
                </div>
                <div className="flex justify-around text-[10px] font-bold text-[var(--cibc-text-secondary)] absolute bottom-2 w-full left-0 px-6">
                  <span>Under</span>
                  <span>In Target</span>
                  <span>Over</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--cibc-text-disabled)] italic">
              * Allocation Drift represents the average deviation from target
              allocation across all asset classes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
