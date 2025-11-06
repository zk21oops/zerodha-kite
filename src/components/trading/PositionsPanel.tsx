import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePositions } from "@/hooks/useTradingData";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PositionsPanel() {
  const { positions, squareOff } = usePositions();
  const { toast } = useToast();
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const isPositive = totalPnl >= 0;

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg">Open Positions</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-text-medium">Total P&L:</span>
          <span
            className={`text-xl font-bold ${
              isPositive ? "text-success" : "text-error"
            }`}
          >
            {isPositive ? "+" : ""}₹{totalPnl.toFixed(2)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {positions.map((position, index) => {
          const isPnlPositive = position.pnl >= 0;
          return (
            <motion.div
              key={position.symbol}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-background rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-text-high">{position.symbol}</p>
                  <p className="text-xs text-text-medium">Qty: {position.qty}</p>
                </div>
                <div
                  className={`text-right font-semibold ${
                    isPnlPositive ? "text-success" : "text-error"
                  }`}
                >
                  {isPnlPositive ? "+" : ""}₹{position.pnl.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-text-medium mt-2">
                <div className="space-x-4">
                  <span>Avg: ₹{position.avg.toFixed(2)}</span>
                  <span>LTP: ₹{position.ltp.toFixed(2)}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={async () => {
                    const order = await squareOff(position.symbol);
                    if (order) {
                      toast({
                        title: "Position Squared Off",
                        description: `${position.symbol} position closed at ₹${position.ltp.toFixed(2)}`,
                      });
                    }
                  }}
                >
                  <X className="w-3 h-3 mr-1" />
                  Exit
                </Button>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
