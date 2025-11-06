import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useWatchlist } from "@/hooks/useTradingData";

export function Watchlist() {
  const stocks = useWatchlist();

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Watchlist</CardTitle>
        <Button variant="ghost" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-1">
        {stocks.map((stock, index) => {
          const isPositive = stock.change >= 0;
          return (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 hover:bg-sidebar-accent rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-text-high text-sm">
                    {stock.symbol}
                  </p>
                  <p className="text-xs text-text-medium">NSE</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-text-high">
                    ₹{stock.ltp.toFixed(2)}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      isPositive ? "text-success" : "text-error"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
