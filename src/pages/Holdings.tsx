import { useState } from "react";
import { TradingSidebar } from "@/components/trading/TradingSidebar";
import { TradingHeader } from "@/components/trading/TradingHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHoldings } from "@/hooks/useTradingData";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";

export default function Holdings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { holdings, summary } = useHoldings();

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
          className="flex-1 overflow-auto p-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="text-sm text-text-medium mb-1">Total Investment</div>
                <div className="text-2xl font-bold text-text-high">
                  ₹{summary.totalInvested.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="text-sm text-text-medium mb-1">Current Value</div>
                <div className="text-2xl font-bold text-text-high">
                  ₹{summary.totalCurrent.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="text-sm text-text-medium mb-1">Total P&L</div>
                <div
                  className={`text-2xl font-bold ${
                    summary.totalPnl >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {summary.totalPnl >= 0 ? "+" : ""}₹{summary.totalPnl.toFixed(2)}
                </div>
                <div
                  className={`text-xs flex items-center gap-1 ${
                    summary.totalPnl >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {summary.totalPnl >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {summary.totalPnlPercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="text-sm text-text-medium mb-1">Day's P&L</div>
                <div
                  className={`text-2xl font-bold ${
                    summary.totalDayChange >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {summary.totalDayChange >= 0 ? "+" : ""}₹
                  {summary.totalDayChange.toFixed(2)}
                </div>
                <div
                  className={`text-xs flex items-center gap-1 ${
                    summary.totalDayChange >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {summary.totalDayChange >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {summary.totalDayChangePercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Holdings Table */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Holdings ({holdings.length})</CardTitle>
              <Button variant="outline" size="sm">
                <PieChart className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holdings.map((holding, index) => (
                  <motion.div
                    key={holding.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-background rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-text-high text-lg">
                            {holding.symbol}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {holding.qty} shares
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-text-medium">Avg. Price</p>
                            <p className="font-semibold text-text-high">
                              ₹{holding.avgPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-medium">LTP</p>
                            <p className="font-semibold text-text-high">
                              ₹{holding.ltp.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-medium">Invested</p>
                            <p className="font-semibold text-text-high">
                              ₹{holding.invested.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-medium">Current</p>
                            <p className="font-semibold text-text-high">
                              ₹{holding.currentValue.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-2 ml-4">
                        <div>
                          <p className="text-xs text-text-medium mb-1">Overall P&L</p>
                          <p
                            className={`text-lg font-bold ${
                              holding.pnl >= 0 ? "text-success" : "text-error"
                            }`}
                          >
                            {holding.pnl >= 0 ? "+" : ""}₹{holding.pnl.toFixed(2)}
                          </p>
                          <p
                            className={`text-xs ${
                              holding.pnl >= 0 ? "text-success" : "text-error"
                            }`}
                          >
                            ({holding.pnl >= 0 ? "+" : ""}
                            {holding.pnlPercent.toFixed(2)}%)
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-text-medium mb-1">Day P&L</p>
                          <p
                            className={`text-sm font-semibold ${
                              holding.dayChange >= 0 ? "text-success" : "text-error"
                            }`}
                          >
                            {holding.dayChange >= 0 ? "+" : ""}₹
                            {holding.dayChange.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.main>
      </div>
    </div>
  );
}
