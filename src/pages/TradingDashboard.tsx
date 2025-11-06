import { useState } from "react";
import { TradingSidebar } from "@/components/trading/TradingSidebar";
import { TradingHeader } from "@/components/trading/TradingHeader";
import { ChartSection } from "@/components/trading/ChartSection";
import { OrderPanel } from "@/components/trading/OrderPanel";
import { Watchlist } from "@/components/trading/Watchlist";
import { PositionsPanel } from "@/components/trading/PositionsPanel";
import { MarketDepth } from "@/components/trading/MarketDepth";
import { FundsPanel } from "@/components/trading/FundsPanel";
import { motion } from "framer-motion";

export default function TradingDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <TradingSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TradingHeader />

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }}
          className="flex-1 overflow-auto p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <ChartSection />
              <MarketDepth symbol="NIFTY 50" />
            </div>

            {/* Right Sidebar - Order Panel, Funds & Watchlist */}
            <div className="space-y-6">
              <OrderPanel symbol="NIFTY 50" currentPrice={21850.45} />
              <FundsPanel />
              <Watchlist />
            </div>

            {/* Positions Panel - Full Width */}
            <div className="lg:col-span-3">
              <PositionsPanel />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
