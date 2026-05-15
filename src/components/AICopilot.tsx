import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Send,
  AlertTriangle,
  LineChart,
  Loader2,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

interface AICopilotProps {
  onApplyRecommendation: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  isInitialCard?: boolean;
}

export function AICopilot({ onApplyRecommendation }: AICopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "user",
      text: "Client needs $250K for a home purchase in 60 days. Show me the lowest-tax withdrawal plan that keeps the IPS within tolerance.",
    },
    {
      id: "2",
      role: "model",
      text: "I've created a scenario based on your request. Here is the lowest-tax withdrawal plan that maintains your IPS within tolerance.",
      isInitialCard: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        text: userMessage,
      },
    ]);

    setIsGenerating(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));
      history.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
          systemInstruction:
            "You are an AI Advisor Assistant helping a wealth manager. Provide concise, professional, and clear answers. You help with tax optimization, portfolio allocation, and scenario analysis.",
        },
      });

      const messageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: messageId, role: "model", text: "" },
      ]);

      for await (const chunk of response) {
        if (chunk.text) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, text: m.text + chunk.text } : m,
            ),
          );
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <aside className="w-80 border-l border-[var(--cibc-border-primary)] flex flex-col bg-[var(--cibc-bg-secondary)] shrink-0 relative overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--cibc-border-primary)] bg-[var(--cibc-bg-primary)] flex justify-between items-center relative z-10 shrink-0">
        <span className="font-bold text-xs uppercase tracking-widest text-[var(--cibc-text-secondary)]">
          AI Advisor Assistant
        </span>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-20">
        {messages.map((msg) => {
          if (msg.role === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-[var(--cibc-burgundy-bg)] text-[var(--cibc-burgundy-dark)] p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed max-w-[90%] shadow-sm break-words whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.isInitialCard) {
            return (
              <div
                key={msg.id}
                className="bg-[var(--cibc-bg-primary)] border border-[var(--cibc-burgundy-tint)] rounded-xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 text-[var(--cibc-burgundy)] font-bold text-xs">
                  <Sparkles className="w-4 h-4" /> Optimal Strategy Found
                </div>
                <p className="text-[11px] text-[var(--cibc-text-secondary)] leading-relaxed">
                  {msg.text}
                </p>

                <div className="grid grid-cols-2 gap-2 py-2 border-y border-[var(--cibc-border-primary)]">
                  <div className="text-[10px] text-[var(--cibc-text-disabled)]">
                    Tax Impact
                    <br />
                    <span className="text-[var(--cibc-text-primary)] font-bold text-xs">
                      $4,321
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--cibc-text-disabled)]">
                    Proceeds
                    <br />
                    <span className="text-[var(--cibc-text-primary)] font-bold text-xs">
                      $245,679
                    </span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-[10px]">
                  {[
                    "Utilizes $42K in available losses to offset gains.",
                    "Draws from long-term gains before short-term gains.",
                    "Uses registered accounts after maximizing tax-efficient sources.",
                    "Maintains all asset class allocations within IPS tolerance.",
                  ].map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[var(--cibc-success-deep)]"
                    >
                      <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onApplyRecommendation}
                  className="w-full py-2 cibc-btn-primary text-[11px] font-bold rounded-lg transition-transform active:scale-95 flex justify-center items-center gap-2"
                >
                  View Recommended Plan
                </button>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex justify-start">
              <div className="bg-[var(--cibc-bg-primary)] border border-[var(--cibc-border-primary)] text-[var(--cibc-text-primary)] p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed max-w-[90%] shadow-sm break-words whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-[var(--cibc-bg-primary)] border border-[var(--cibc-border-primary)] p-3 rounded-2xl rounded-tl-none text-xs text-[var(--cibc-text-disabled)] shadow-sm flex items-center gap-2 max-w-[90%]">
              <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
            </div>
          </div>
        )}

        {/* Dynamic Insights Tabs & Cards - Rendered only at the bottom */}
        <div className="space-y-3 pt-4 border-t border-[var(--cibc-border-primary)]">
          <div className="flex border-b border-[var(--cibc-border-primary)] text-[10px] font-bold">
            <div className="px-3 py-2 border-b-2 border-[var(--cibc-burgundy)] text-[var(--cibc-burgundy)]">
              Insights
            </div>
            <div className="px-3 py-2 text-[var(--cibc-text-disabled)]">Opportunities (6)</div>
          </div>

          <div className="bg-[var(--cibc-bg-primary)] border border-[var(--cibc-border-primary)] p-3 rounded-lg flex gap-3 items-start cursor-pointer hover:bg-[var(--cibc-bg-secondary)] transition-colors">
            <div className="p-2 bg-[var(--cibc-info-bg)] text-[var(--cibc-info)] rounded-md">
              <LineChart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold">Tax Loss Harvesting</p>
              <p className="text-[10px] text-[var(--cibc-text-secondary)]">
                You have $142,300 in unrealized losses available across 3
                accounts.
              </p>
              <div className="text-[10px] text-[var(--cibc-info)] font-bold mt-1">
                View Opportunities &rarr;
              </div>
            </div>
          </div>

          <div className="bg-[var(--cibc-bg-primary)] border border-[var(--cibc-border-primary)] p-3 rounded-lg flex gap-3 items-start cursor-pointer hover:bg-[var(--cibc-bg-secondary)] transition-colors">
            <div className="p-2 bg-[var(--cibc-success-bg)] text-[var(--cibc-success-deep)] rounded-md flex items-center justify-center font-bold text-base h-8 w-8 shrink-0">
              $
            </div>
            <div>
              <p className="text-[11px] font-bold">Cash Efficiency</p>
              <p className="text-[10px] text-[var(--cibc-text-secondary)]">
                $165,950 in cash is earning 1.2%. Consider reinvesting excess
                cash.
              </p>
              <div className="text-[10px] text-[var(--cibc-info)] font-bold mt-1">
                View Details &rarr;
              </div>
            </div>
          </div>

          <div className="bg-[var(--cibc-bg-primary)] border border-[var(--cibc-border-primary)] p-3 rounded-lg flex gap-3 items-start cursor-pointer hover:bg-[var(--cibc-bg-secondary)] transition-colors">
            <div className="p-2 bg-[var(--cibc-warning)]/10 text-[var(--cibc-warning)] rounded-md h-8 w-8 flex justify-center items-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold">Upcoming Need</p>
              <p className="text-[10px] text-[var(--cibc-text-secondary)]">
                RMD of $35,420 due in 2025. Consider tax-efficient strategy.
              </p>
              <div className="text-[10px] text-[var(--cibc-info)] font-bold mt-1">
                View Planning Ideas &rarr;
              </div>
            </div>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-[var(--cibc-bg-primary)] border-t border-[var(--cibc-border-primary)] absolute bottom-0 left-0 w-full z-10 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="w-full border border-[var(--cibc-border-primary)] rounded-full pl-4 pr-10 py-2 text-[11px] focus:outline-none focus:border-[var(--cibc-burgundy)] shadow-inner bg-[var(--cibc-bg-secondary)] transition-colors"
            disabled={isGenerating}
          />
          <button
            onClick={handleSend}
            disabled={isGenerating || !inputValue.trim()}
            className="absolute right-2 top-1.5 p-1 text-[var(--cibc-burgundy)] hover:bg-[var(--cibc-burgundy-tint)]/20 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
