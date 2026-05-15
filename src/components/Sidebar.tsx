import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Briefcase,
  FileText,
  Lightbulb,
  LineChart,
  UserCircle,
  Folder,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const items = [
    { name: "Overview", id: "overview", icon: LayoutDashboard },
    { name: "Cash & Tax Optimizer", id: "optimizer", icon: Settings },
    { name: "Accounts", id: "accounts", icon: CreditCard },
    { name: "Portfolios", id: "portfolios", icon: Briefcase },
    { name: "Reports", id: "reports", icon: FileText },
    { name: "Opportunities", id: "opportunities", icon: Lightbulb },
    { name: "Scenarios", id: "scenarios", icon: LineChart },
    { name: "Client Profile", id: "profile", icon: UserCircle },
    { name: "Documents", id: "documents", icon: Folder },
  ];

  return (
    <nav className="w-[260px] bg-[var(--cibc-bg-dark)] text-[#FFFFFF] flex flex-col h-full shrink-0">
      <div className="p-6 bg-[var(--cibc-bg-primary)] h-[64px] flex items-center border-b border-[var(--cibc-border-primary)]">
        <span className="cibc-logo">
          <span className="cibc-logo__cibc">CIBC</span>
          <span className="cibc-logo__pw">Private Wealth</span>
        </span>
      </div>
      <div className="flex-1 py-4 text-xs font-medium uppercase tracking-wider overflow-y-auto">
        <ul className="flex flex-col h-full">
          {items.map((item, i) => (
            <li
              key={i}
              className={item.name === "Client Profile" ? "mt-auto" : ""}
            >
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
                  activeView === item.id
                    ? "sidebar-item active text-white"
                    : "sidebar-item hover:bg-[rgba(255,255,255,0.05)] text-[var(--cibc-text-reverse)] opacity-80 hover:opacity-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--cibc-burgundy)] flex items-center justify-center text-white text-[10px] font-bold">
            SJ
          </div>
          <div className="text-xs text-left">
             <p className="text-white font-semibold m-0 leading-tight">
              Sarah Johnson
            </p>
            <p className="text-white opacity-70 m-0 leading-tight mt-0.5">
              Wealth Advisor
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
