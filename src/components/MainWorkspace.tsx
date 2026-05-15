import { useState, useEffect } from "react";
import { Settings2, ArrowRightLeft, Loader2, CheckCircle2 } from "lucide-react";

interface MainWorkspaceProps {
  kpis: {
    estTaxImpact: number;
    allocationDrift: number;
    afterTaxProceeds: number;
  };
  isRecalculating: boolean;
  onOverrideChange: (overrideTotal: number, taxImpact: number) => void;
  onTableDataChange?: (
    data: { account: string; override: number; tax: number; rec: string }[],
  ) => void;
  onOpenModal: (data: {
    overrideTotal: number;
    lossesHarvested: number;
  }) => void;
}

const mockData = [
  {
    account: "Taxable Portfolio",
    balance: 2456231,
    cash: 78450,
    gl: "+$186,230",
    alloc: "28% / 30%",
    rec: "Withdraw $100,000",
    override: 100000,
    tax: 6842,
  },
  {
    account: "Taxable Direct Index",
    balance: 1032145,
    cash: 12300,
    gl: "-$68,420",
    alloc: "12% / 10%",
    rec: "Harvest Losses $20,000",
    override: 20000,
    tax: 0,
  },
  {
    account: "RRSP - Growth",
    balance: 2145672,
    cash: 0,
    gl: "N/A",
    alloc: "24% / 25%",
    rec: "No Action",
    override: 0,
    tax: 0,
  },
  {
    account: "TFSA - Growth",
    balance: 876231,
    cash: 18900,
    gl: "+$15,230",
    alloc: "10% / 10%",
    rec: "Withdraw $81,300",
    override: 81300,
    tax: 0,
  },
  {
    account: "Cash Account",
    balance: 165950,
    cash: 48700,
    gl: "N/A",
    alloc: "5% / 5%",
    rec: "Use Cash $48,700",
    override: 48700,
    tax: 0,
  },
  {
    account: "RESP",
    balance: 425316,
    cash: 7600,
    gl: "N/A",
    alloc: "4% / 5%",
    rec: "No Action",
    override: 0,
    tax: 0,
  },
  {
    account: "LIRA",
    balance: 326946,
    cash: 0,
    gl: "N/A",
    alloc: "2% / 2%",
    rec: "No Action",
    override: 0,
    tax: 0,
  },
];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(val);

export function MainWorkspace({
  kpis,
  isRecalculating,
  onOverrideChange,
  onTableDataChange,
  onOpenModal,
}: MainWorkspaceProps) {
  const [tableData, setTableData] = useState(() =>
    mockData.map((row) => ({
      ...row,
      overrideStr:
        row.override === 0
          ? "$ 0.00"
          : "$ " +
            row.override.toLocaleString("en-US", {
              minimumFractionDigits: row.override % 1 === 0 ? 0 : 2,
              maximumFractionDigits: 2,
            }),
    })),
  );

  useEffect(() => {
    if (onTableDataChange) {
      onTableDataChange(
        tableData.map((r) => ({
          account: r.account,
          override: r.override,
          tax: r.tax,
          rec: r.rec,
        })),
      );
    }
  }, [tableData, onTableDataChange]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEngineLoading, setIsEngineLoading] = useState(false);

  const overrideTotal = tableData.reduce((acc, row) => acc + row.override, 0);

  const handleReviewExecute = () => {
    setIsEngineLoading(true);
    const directIndexRow = tableData.find(
      (row) => row.account === "Taxable Direct Index",
    );
    const lossesHarvested = directIndexRow ? directIndexRow.override : 20000;

    setTimeout(() => {
      setIsEngineLoading(false);
      onOpenModal({ overrideTotal, lossesHarvested });
    }, 2000);
  };

  const handleInputChange = (index: number, val: string) => {
    if (/[^\d$.,\s]/.test(val)) {
      setToastMessage("Only numbers and the symbols $ . , are allowed.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const newData = [...tableData];
    newData[index].overrideStr = val;

    const cleanStr = val.replace(/[^0-9.]/g, "");
    let numVal = parseFloat(cleanStr);
    if (isNaN(numVal)) numVal = 0;

    newData[index].override = numVal;

    const row = newData[index];

    // Calculate tax dynamically for every account
    if (row.account === "RRSP - Growth") {
      // Fully taxable, using an assumed marginal rate of 30% (since capital gains rate is 15%)
      row.tax = numVal * 0.3;
    } else if (row.account === "Taxable Direct Index") {
      const maxLosses = 80720;
      const actualLosses = Math.min(numVal, maxLosses);
      row.tax = 0;
    } else if (row.type === "Registered" || row.account === "Cash Account") {
      row.tax = 0;
    } else {
      // For taxable accounts with positive gains (e.g. Taxable Portfolio)
      const parseGL = parseFloat(row.gl.replace(/[^0-9.-]/g, "")) || 0;
      if (parseGL > 0 && row.balance > 0) {
        row.tax = (numVal / row.balance) * parseGL * 0.90241;
      } else {
        row.tax = 0;
      }
    }

    setTableData(newData);

    const newOverrideTotal = newData.reduce(
      (acc, row) => acc + row.override,
      0,
    );
    
    let sumTaxes = newData.reduce((acc, row) => acc + row.tax, 0);
    const directIndexRow = newData.find(r => r.account === "Taxable Direct Index");
    const harvestedLosses = directIndexRow ? directIndexRow.override : 0;
    const taxSavings = harvestedLosses * 0.15;
    const newTaxTotal = Math.max(0, sumTaxes - taxSavings);

    onOverrideChange(newOverrideTotal, newTaxTotal);
  };

  const handleInputBlur = (index: number) => {
    const newData = [...tableData];
    const numVal = newData[index].override;
    if (numVal === 0) {
      newData[index].overrideStr = "$ 0.00";
    } else {
      newData[index].overrideStr =
        "$ " +
        numVal.toLocaleString("en-US", {
          minimumFractionDigits: numVal % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        });
    }
    setTableData(newData);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--cibc-bg-primary)] overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[var(--cibc-bg-error)] text-[var(--cibc-text-error)] text-xs font-bold px-4 py-2 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}
      {isEngineLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--cibc-bg-dark)]/50 backdrop-blur-sm">
          <div className="bg-[var(--cibc-bg-primary)] p-6 rounded-xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4">
            <Loader2 className="w-8 h-8 text-[var(--cibc-burgundy)] animate-spin mb-4" />
            <p className="text-[var(--cibc-text-primary)] font-bold text-center">
              Tax engine is calculating...
            </p>
            <p className="text-[var(--cibc-text-secondary)] text-sm text-center mt-1">
              Please wait while the optimal scenarios are being generated.
            </p>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="px-8 py-6 cibc-header flex justify-between items-end mb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[var(--cibc-text-primary)] mb-1">
              Smith Family{" "}
              <span className="text-[var(--cibc-text-disabled)] font-normal">
                | CIBC Private Wealth
              </span>
            </h1>
            <div className="flex gap-6 text-sm">
              <div className="flex flex-col">
                <span className="text-[var(--cibc-text-secondary)] text-[10px] uppercase font-bold tracking-wider">
                  Total Market Value
                </span>
                <span className="text-[var(--cibc-text-primary)] font-bold text-lg">
                  $7,428,491
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Info */}
          <div className="text-right">
            <div className="cibc-card-compact p-3">
              <p className="text-xs text-[var(--cibc-text-secondary)] font-medium">
                Scenario:{" "}
                <span className="text-[var(--cibc-text-primary)] font-bold">
                  Withdrawal Plan (Draft)
                </span>
              </p>
              <p className="text-xs text-[var(--cibc-text-secondary)]">
                Goal:{" "}
                <span className="text-[var(--cibc-text-primary)]">
                  Fund home purchase ($250,000)
                </span>
              </p>
              <p className="text-[10px] text-[var(--cibc-text-disabled)] mt-1">
                Due: June 30, 2025
              </p>
            </div>
          </div>
        </header>

        {/* KPI Summary */}
        <div className="px-8 mb-4">
          <div className="grid grid-cols-3 gap-4 relative overflow-hidden">
            <div
              className={`loading-overlay ${isRecalculating ? "active" : ""}`}
            >
              Recalculating Impact...
            </div>
            <div className="cibc-card-compact p-4">
              <p className="text-[10px] font-bold text-[var(--cibc-text-disabled)] uppercase mb-1 tracking-widest">
                Est. Tax Impact
              </p>
              <p className="text-xl font-bold text-[var(--cibc-text-primary)]">
                {formatCurrency(kpis.estTaxImpact)}
              </p>
              <p className="text-[10px] text-[var(--cibc-text-secondary)] mt-1">
                Long term projected
              </p>
            </div>
            <div className="cibc-card-compact p-4">
              <p className="text-[10px] font-bold text-[var(--cibc-text-disabled)] uppercase mb-1 tracking-widest">
                Allocation Drift
              </p>
              <p className="text-xl font-bold text-[var(--cibc-text-primary)]">
                {kpis.allocationDrift.toFixed(1)}%
              </p>
              <p className="text-[10px] cibc-text-success font-medium flex items-center gap-1 mt-1">
                ● Within IPS
              </p>
            </div>
            <div className="cibc-card-compact p-4">
              <p className="text-[10px] font-bold text-[var(--cibc-text-disabled)] uppercase mb-1 tracking-widest">
                After-Tax Proceeds
              </p>
              <p className="text-xl font-bold text-[var(--cibc-text-primary)]">
                {formatCurrency(kpis.afterTaxProceeds)}
              </p>
              <p className="text-[10px] text-[var(--cibc-text-secondary)] mt-1">
                Estimated net of tax
              </p>
            </div>
          </div>
        </div>

        {/* Table section container */}
        <section className="flex-1 px-8 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--cibc-text-primary)]">
              <span className="w-2 h-4 bg-[var(--cibc-burgundy)]"></span> Optimization Table
            </h2>
            <button className="cibc-btn-secondary py-1.5 text-xs">
              <Settings2 className="w-3 h-3 mr-2" />
              Scenario Settings
            </button>
          </div>

          <div className="border border-[var(--cibc-border-primary)] rounded-lg overflow-hidden">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-[var(--cibc-bg-secondary)] border-b border-[var(--cibc-border-primary)] text-[var(--cibc-text-secondary)] font-bold uppercase">
                <tr className="divide-x divide-gray-200">
                  <th className="p-3">Account / Sleeve</th>
                  <th className="p-3 text-right">Account Balance</th>
                  <th className="p-3 text-right">Available Cash</th>
                  <th className="p-3 text-right">Unrealized G/L</th>
                  <th className="p-3 text-right">Alloc (Cur/Tgt)</th>
                  <th className="p-3">System Rec.</th>
                  <th className="p-3">Advisor Override</th>
                  <th className="p-3 text-right">Est. Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cibc-border-primary)] text-[var(--cibc-text-primary)]">
                {tableData.map((row, i) => {
                  let glColor = "text-[var(--cibc-text-secondary)]";
                  if (row.gl.startsWith("+$"))
                    glColor = "text-[var(--cibc-success-deep)] font-medium";
                  else if (row.gl.startsWith("-$"))
                    glColor = "text-[var(--cibc-text-error)] font-medium";
                  else if (row.gl === "N/A") glColor = "text-[var(--cibc-text-disabled)]";

                  let recColor = "text-[var(--cibc-text-primary)] font-medium";
                  if (row.rec.includes("Harvest")) recColor = "text-[var(--cibc-info)]";

                  return (
                    <tr
                      key={i}
                      className="divide-x divide-[var(--cibc-border-primary)] hover:bg-[var(--cibc-bg-secondary)] transition-colors"
                    >
                      <td className="p-3">{row.account}</td>
                      <td className="p-3 text-right font-medium">
                        {formatCurrency(row.balance)}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatCurrency(row.cash)}
                      </td>
                      <td className={`p-3 text-right ${glColor}`}>{row.gl}</td>
                      <td className="p-3 text-right">{row.alloc}</td>
                      <td className={`p-3 ${recColor}`}>{row.rec}</td>
                      <td className="p-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={row.overrideStr}
                            onChange={(e) =>
                              handleInputChange(i, e.target.value)
                            }
                            onBlur={() => handleInputBlur(i)}
                            className="input-field override-input pl-3"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatCurrency(row.tax)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-[var(--cibc-bg-secondary)]">
                  <td className="p-3 font-bold text-[var(--cibc-text-primary)] border-t border-[var(--cibc-border-primary)]">
                    TOTALS
                  </td>
                  <td className="p-3 text-right font-bold border-t border-[var(--cibc-border-primary)]">
                    {formatCurrency(7428491)}
                  </td>
                  <td className="p-3 text-right font-bold border-t border-[var(--cibc-border-primary)]">
                    {formatCurrency(165950)}
                  </td>
                  <td colSpan={3} className="border-t border-[var(--cibc-border-primary)]"></td>
                  <td className="p-3 font-bold text-[var(--cibc-burgundy)] text-right border-t border-[var(--cibc-border-primary)]">
                    <div className="flex items-center justify-end gap-2">
                      {overrideTotal !== 250000 && (
                        <span
                          className={`text-xs font-normal ${
                            overrideTotal > 250000
                              ? "text-[var(--cibc-success-deep)]"
                              : "text-[var(--cibc-text-error)]"
                          }`}
                        >
                          diff {overrideTotal > 250000 ? "+" : ""}
                          {formatCurrency(overrideTotal - 250000)}
                        </span>
                      )}
                      {formatCurrency(overrideTotal)}
                    </div>
                  </td>
                  <td className="p-3 text-right font-bold border-t border-[var(--cibc-border-primary)]">
                    {formatCurrency(kpis.estTaxImpact)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Actions section */}
          <div className="mt-6 py-4 cibc-header flex justify-between items-center border-t-0 !bg-transparent border-b-0">
            <div className="flex items-center gap-2 text-xs cibc-pill-success">
              <CheckCircle2 className="w-4 h-4 cibc-text-success-deep" />
              <span>
                This plan meets your cash need and stays within your IPS.
              </span>
            </div>

            <div className="flex gap-3">
              <button className="cibc-btn-secondary">
                Recalculate
              </button>
              <button className="cibc-btn-secondary">
                Save Scenario
              </button>
              <button
                onClick={handleReviewExecute}
                className="cibc-btn-primary"
              >
                Review & Execute
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
