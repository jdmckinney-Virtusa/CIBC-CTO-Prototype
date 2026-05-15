import { useState } from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface AccountsWorkspaceProps {
  onBack: () => void;
  accountData?: {
    account: string;
    override: number;
    tax: number;
    rec: string;
  }[];
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

export function AccountsWorkspace({
  onBack,
  accountData,
}: AccountsWorkspaceProps) {
  const [activeAccount, setActiveAccount] = useState("Taxable Direct Index");
  const [harvestStates, setHarvestStates] = useState<Record<string, boolean>>(
    {},
  );

  const baseAccountsList = [
    {
      name: "Taxable Portfolio",
      type: "Non-Registered",
      value: 2456231,
      cash: 78450,
      gl: "+$186,230",
      glPercent: "+7.6%",
      allocCur: "28%",
      allocTgt: "30%",
      rec: "Withdraw",
      recValue: 100000,
      tax: 6842,
      losses: false,
    },
    {
      name: "Taxable Direct Index",
      type: "Non-Registered",
      value: 1032145,
      cash: 12300,
      gl: "-$68,420",
      glPercent: "-6.2%",
      allocCur: "12%",
      allocTgt: "10%",
      rec: "Harvest Losses",
      recValue: 20000,
      tax: 0,
      losses: true,
    },
    {
      name: "RRSP - Growth",
      type: "Registered",
      value: 2145672,
      cash: 0,
      gl: "N/A",
      glPercent: "",
      allocCur: "24%",
      allocTgt: "25%",
      rec: "No Action",
      recValue: 0,
      tax: 0,
      losses: false,
    },
    {
      name: "TFSA - Growth",
      type: "Registered",
      value: 876231,
      cash: 18900,
      gl: "+$15,230",
      glPercent: "+1.7%",
      allocCur: "10%",
      allocTgt: "10%",
      rec: "Withdraw",
      recValue: 81300,
      tax: 0,
      losses: false,
    },
    {
      name: "Cash Account",
      type: "Non-Registered",
      value: 165950,
      cash: 48700,
      gl: "N/A",
      glPercent: "",
      allocCur: "5%",
      allocTgt: "5%",
      rec: "Use Cash",
      recValue: 48700,
      tax: 0,
      losses: false,
    },
    {
      name: "RESP",
      type: "Registered",
      value: 425316,
      cash: 7600,
      gl: "N/A",
      glPercent: "",
      allocCur: "4%",
      allocTgt: "5%",
      rec: "No Action",
      recValue: 0,
      tax: 0,
      losses: false,
    },
    {
      name: "LIRA",
      type: "Registered",
      value: 326946,
      cash: 0,
      gl: "N/A",
      glPercent: "",
      allocCur: "2%",
      allocTgt: "2%",
      rec: "No Action",
      recValue: 0,
      tax: 0,
      losses: false,
    },
  ];

  const accountsList = baseAccountsList.map((acc) => {
    const updatedData = accountData?.find((d) => d.account === acc.name);
    if (updatedData) {
      return {
        ...acc,
        recValue: updatedData.override,
        tax: updatedData.tax,
        // Since rec text might strictly say 'Withdraw $100,000', in Accounts we might just say 'Withdraw' or map it
        // Depending on what 'rec' in updatedData has. 'Withdraw $x' -> 'Withdraw'
        rec:
          updatedData.rec.split(" ")[0] === "Harvest"
            ? "Harvest Losses"
            : updatedData.rec.split(" ")[0] === "Use"
              ? "Use Cash"
              : updatedData.rec.split(" ")[0] === "No"
                ? "No Action"
                : updatedData.rec.split(" ")[0],
      };
    }
    return acc;
  });

  const activeAccountData =
    accountsList.find((a) => a.name === activeAccount) || accountsList[1];
  const scaleRatio = activeAccountData.value / 1032145;

  const lossOpportunities = [
    { id: "1", symbol: "ENBRIDGE INC", shares: 1250, value: 45625, gl: -8420 },
    { id: "2", symbol: "BCE INC", shares: 2000, value: 22300, gl: -5230 },
    { id: "3", symbol: "TC ENERGY CORP", shares: 800, value: 18720, gl: -3690 },
  ];

  const handleHarvest = (id: string) => {
    setHarvestStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setHarvestStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--cibc-bg-primary)] overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      {/* Header section */}
      <header className="px-8 py-6 cibc-header">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center text-[var(--cibc-text-secondary)] hover:text-[var(--cibc-text-primary)] transition-colors font-medium text-sm"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
            </button>
            <h1 className="text-2xl font-bold text-[var(--cibc-text-primary)]">Smith Family</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="cibc-btn-secondary py-2 text-sm">
              Edit Overrides
            </button>
            <button className="cibc-btn-secondary py-2 px-2">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex gap-8 text-sm font-medium">
          <button className="text-[var(--cibc-burgundy)] border-b-2 border-[var(--cibc-burgundy)] pb-3 px-1 font-semibold">
            Account View
          </button>
          <button className="text-[var(--cibc-text-secondary)] hover:text-[var(--cibc-text-primary)] pb-3 px-1 transition-colors">
            Holdings View
          </button>
          <button className="text-[var(--cibc-text-secondary)] hover:text-[var(--cibc-text-primary)] pb-3 px-1 transition-colors">
            Tax Lots View
          </button>
          <button className="text-[var(--cibc-text-secondary)] hover:text-[var(--cibc-text-primary)] pb-3 px-1 transition-colors">
            Activity
          </button>
        </nav>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Accounts List */}
        <aside className="w-72 border-r border-[var(--cibc-border-primary)] flex flex-col bg-[var(--cibc-bg-secondary)] overflow-hidden shrink-0">
          <div className="p-4 border-b border-[var(--cibc-border-primary)]">
            <h2 className="text-sm font-bold text-[var(--cibc-text-primary)]">All Accounts</h2>
            <div className="text-lg font-bold text-[var(--cibc-text-primary)] mt-1">
              {formatCurrency(accountsList.reduce((acc, curr) => acc + curr.value, 0))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {accountsList.map((acc, idx) => {
              const isActive = activeAccount === acc.name;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveAccount(acc.name)}
                  className={`w-full text-left p-4 border-b border-[var(--cibc-border-primary)] hover:bg-[var(--cibc-border-primary)]/30 transition-colors ${
                    isActive
                      ? "bg-[var(--cibc-bg-primary)] border-l-4 border-l-[var(--cibc-burgundy)]"
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div
                    className={`font-semibold text-sm mb-1 ${isActive ? "text-[var(--cibc-burgundy)]" : "text-[var(--cibc-text-primary)]"}`}
                  >
                    {acc.name}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--cibc-text-secondary)]">{acc.type}</span>
                    <span className="text-sm font-bold text-[var(--cibc-text-primary)]">
                      {formatCurrency(acc.value)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Account Details */}
        <div className="flex-1 overflow-y-auto p-8 bg-[var(--cibc-bg-primary)]">
          {/* Header KPIs */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-[var(--cibc-text-primary)]">
                {activeAccountData.name}
              </h2>
              <span className="px-2.5 py-1 rounded cibc-pill-info font-bold uppercase tracking-wider text-xs">
                {activeAccountData.type}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-[10px] text-[var(--cibc-text-disabled)] font-bold uppercase tracking-widest mb-1">
                  Market Value
                </div>
                <div className="text-xl font-bold text-[var(--cibc-text-primary)]">
                  {formatCurrency(activeAccountData.value)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--cibc-text-disabled)] font-bold uppercase tracking-widest mb-1">
                  Unrealized G/L
                </div>
                <div
                  className={`text-xl font-bold ${activeAccountData.gl.startsWith("+$") ? "text-[var(--cibc-success-deep)]" : activeAccountData.gl.startsWith("-$") ? "text-[var(--cibc-text-error)]" : "text-[var(--cibc-text-primary)]"}`}
                >
                  {activeAccountData.gl}{" "}
                  {activeAccountData.glPercent && (
                    <span className="text-sm font-medium ml-1">
                      ({activeAccountData.glPercent})
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--cibc-text-disabled)] font-bold uppercase tracking-widest mb-1">
                  Available Cash
                </div>
                <div className="text-xl font-bold text-[var(--cibc-text-primary)]">
                  {formatCurrency(activeAccountData.cash)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--cibc-text-disabled)] font-bold uppercase tracking-widest mb-1">
                  Allocation (Cur/Tgt)
                </div>
                <div className="text-xl font-bold text-[var(--cibc-text-primary)]">
                  {activeAccountData.allocCur}{" "}
                  <span className="text-sm text-[var(--cibc-text-disabled)]">
                    / {activeAccountData.allocTgt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout (2x2) */}
          <div className="grid grid-cols-2 gap-6">
            {/* Box 1: Tax Lot Summary Table */}
            <div className="border border-[var(--cibc-border-primary)] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[var(--cibc-bg-secondary)] px-5 py-3 border-b border-[var(--cibc-border-primary)]">
                <h3 className="text-sm font-bold text-[var(--cibc-text-primary)]">
                  Tax Lot Summary
                </h3>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--cibc-bg-primary)] text-[var(--cibc-text-secondary)] font-semibold border-b border-[var(--cibc-border-primary)]">
                  <tr>
                    <th className="px-5 py-2">Holding Period</th>
                    <th className="px-5 py-2 text-right">Market Value</th>
                    <th className="px-5 py-2 text-right">Unrealized G/L</th>
                    <th className="px-5 py-2 text-right">% of Acct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cibc-border-primary)] font-medium text-[var(--cibc-text-primary)]">
                  <tr>
                    <td className="px-5 py-3 text-[var(--cibc-text-primary)]">Long Term Gains</td>
                    <td className="px-5 py-3 text-right">
                      {formatCurrency(256430 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-success-deep)]">
                      +{formatCurrency(18230 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-secondary)]">
                      24.9%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-[var(--cibc-text-primary)]">
                      Long Term Losses
                    </td>
                    <td className="px-5 py-3 text-right">
                      {formatCurrency(302120 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-error)]">
                      -{formatCurrency(42120 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-secondary)]">
                      29.3%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-[var(--cibc-text-primary)]">
                      Short Term Gains
                    </td>
                    <td className="px-5 py-3 text-right">
                      {formatCurrency(142980 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-success-deep)]">
                      +{formatCurrency(6420 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-secondary)]">
                      13.9%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 text-[var(--cibc-text-primary)]">
                      Short Term Losses
                    </td>
                    <td className="px-5 py-3 text-right">
                      {formatCurrency(330615 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-error)]">
                      -{formatCurrency(30800 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-secondary)]">
                      31.9%
                    </td>
                  </tr>
                  <tr className="bg-[var(--cibc-bg-secondary)] font-bold border-t border-[var(--cibc-border-primary)]">
                    <td className="px-5 py-3 text-[var(--cibc-text-primary)]">Total</td>
                    <td className="px-5 py-3 text-right">
                      {formatCurrency(activeAccountData.value)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-error)]">
                      -{formatCurrency(48270 * scaleRatio)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--cibc-text-primary)]">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Box 2: Suggested Actions Table */}
            <div className="border border-[var(--cibc-border-primary)] rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-[var(--cibc-bg-secondary)] px-5 py-3 border-b border-[var(--cibc-border-primary)]">
                <h3 className="text-sm font-bold text-[var(--cibc-text-primary)]">
                  Suggested Actions
                </h3>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4 text-sm font-medium text-[var(--cibc-text-primary)]">
                  <div className="flex justify-between items-center pb-2 border-b border-[var(--cibc-border-primary)]">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[var(--cibc-info)]" />{" "}
                      {activeAccountData.rec}
                    </span>
                    <span>{formatCurrency(activeAccountData.recValue)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[var(--cibc-border-primary)] text-[var(--cibc-text-secondary)]">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4" /> Rebalance Within Sleeve
                    </span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--cibc-text-secondary)]">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4" /> No Action
                    </span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--cibc-border-primary)] flex justify-between items-center bg-[var(--cibc-bg-secondary)] p-4 rounded-lg">
                  <span className="text-sm font-bold text-[var(--cibc-text-primary)]">
                    Est. Tax Impact
                  </span>
                  <span className="text-lg font-bold text-[var(--cibc-text-primary)]">
                    {formatCurrency(activeAccountData.tax)}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: Top Loss Opportunities */}
            <div className="border border-[var(--cibc-border-primary)] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[var(--cibc-bg-secondary)] px-5 py-3 border-b border-[var(--cibc-border-primary)] flex justify-between items-center">
                <h3 className="text-sm font-bold text-[var(--cibc-text-primary)] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[var(--cibc-warning)]" /> Top Loss
                  Opportunities
                </h3>
              </div>
              {activeAccountData.losses ? (
                <>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[var(--cibc-bg-primary)] text-[var(--cibc-text-secondary)] font-semibold border-b border-[var(--cibc-border-primary)]">
                      <tr>
                        <th className="px-5 py-2">Security</th>
                        <th className="px-5 py-2 text-right">Shares</th>
                        <th className="px-5 py-2 text-right">Market Value</th>
                        <th className="px-5 py-2 text-right">Unrealized G/L</th>
                        <th className="px-5 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cibc-border-primary)] font-medium">
                      {lossOpportunities.map((opp) => {
                        const isHarvested = harvestStates[opp.id];
                        return (
                          <tr key={opp.id} className="hover:bg-[var(--cibc-bg-secondary)]/50">
                            <td className="px-5 py-3 text-[var(--cibc-text-primary)] font-bold">
                              {opp.symbol}
                            </td>
                            <td className="px-5 py-3 text-right text-[var(--cibc-text-secondary)]">
                              {opp.shares.toLocaleString()}
                            </td>
                            <td className="px-5 py-3 text-right text-[var(--cibc-text-primary)]">
                              {formatCurrency(opp.value)}
                            </td>
                            <td className="px-5 py-3 text-right text-[var(--cibc-text-error)] font-bold">
                              {formatCurrency(opp.gl)}
                            </td>
                            <td className="px-5 py-3 text-center">
                              <button
                                onClick={() => handleHarvest(opp.id)}
                                disabled={isHarvested}
                                className={`w-[90px] py-1.5 rounded text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 mx-auto ${
                                  isHarvested
                                    ? "cibc-pill-success"
                                    : "bg-[var(--cibc-bg-primary)] border border-[var(--cibc-border-secondary)] text-[var(--cibc-text-primary)] hover:bg-[var(--cibc-bg-secondary)] hover:border-[var(--cibc-border-primary)]"
                                }`}
                              >
                                {isHarvested ? (
                                  <>
                                    <Check className="w-3 h-3" /> Harvested
                                  </>
                                ) : (
                                  "Harvest"
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="bg-[var(--cibc-bg-secondary)] px-5 py-3 border-t border-[var(--cibc-border-primary)]">
                    <button className="text-xs font-semibold text-[var(--cibc-burgundy)] hover:underline">
                      View all loss opportunities (12)
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-[var(--cibc-text-secondary)] font-medium text-sm">
                  No loss opportunities available for this account.
                </div>
              )}
            </div>

            {/* Box 4: Allocation vs Target */}
            <div className="border border-[var(--cibc-border-primary)] rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-[var(--cibc-bg-secondary)] px-5 py-3 border-b border-[var(--cibc-border-primary)]">
                <h3 className="text-sm font-bold text-[var(--cibc-text-primary)]">
                  Allocation vs Target
                </h3>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center items-center relative">
                {/* CSS Mockup of Donut Chart */}
                <div
                  className="relative w-40 h-40 rounded-full flex items-center justify-center mb-4 shadow-inner"
                  style={{
                    background:
                      "conic-gradient(from 0deg, var(--cibc-burgundy) 0% 58%, var(--cibc-info) 58% 90%, var(--cibc-success) 90% 100%)",
                  }}
                >
                  <div className="w-[110px] h-[110px] bg-[var(--cibc-bg-primary)] rounded-full flex items-center justify-center shadow-sm">
                    <span className="font-bold text-[var(--cibc-text-secondary)] text-xs">
                      Total Alloc
                    </span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--cibc-burgundy)]"></div>
                      <span className="text-[10px] font-bold text-[var(--cibc-text-secondary)] uppercase">
                        Equity
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[var(--cibc-text-primary)]">
                      58%{" "}
                      <span className="text-[var(--cibc-text-disabled)] font-normal">/ 60%</span>
                    </div>
                  </div>
                  <div className="text-center border-l border-[var(--cibc-border-primary)]">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--cibc-info)]"></div>
                      <span className="text-[10px] font-bold text-[var(--cibc-text-secondary)] uppercase whitespace-nowrap">
                        Fixed Inc.
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[var(--cibc-text-primary)]">
                      32%{" "}
                      <span className="text-[var(--cibc-text-disabled)] font-normal">/ 30%</span>
                    </div>
                  </div>
                  <div className="text-center border-l border-[var(--cibc-border-primary)]">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-[var(--cibc-success)]"></div>
                      <span className="text-[10px] font-bold text-[var(--cibc-text-secondary)] uppercase">
                        Cash
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[var(--cibc-text-primary)]">
                      10%{" "}
                      <span className="text-[var(--cibc-text-disabled)] font-normal">/ 10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
