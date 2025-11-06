import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketDepth } from "@/hooks/useTradingData";
import { motion } from "framer-motion";

interface MarketDepthProps {
  symbol: string;
}

export function MarketDepth({ symbol }: MarketDepthProps) {
  const depth = useMarketDepth(symbol);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Market Depth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Bids */}
          <div>
            <div className="text-xs font-semibold text-text-medium mb-2 pb-2 border-b border-border">
              <div className="grid grid-cols-3 gap-2">
                <span>Bid</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Orders</span>
              </div>
            </div>
            <div className="space-y-1">
              {depth.bids.map((bid, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="grid grid-cols-3 gap-2 text-xs p-1.5 rounded bg-success/5 hover:bg-success/10 transition-colors"
                >
                  <span className="font-semibold text-success">
                    ₹{bid.price.toFixed(2)}
                  </span>
                  <span className="text-right text-text-high">{bid.quantity}</span>
                  <span className="text-right text-text-medium">{bid.orders}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Asks */}
          <div>
            <div className="text-xs font-semibold text-text-medium mb-2 pb-2 border-b border-border">
              <div className="grid grid-cols-3 gap-2">
                <span>Ask</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Orders</span>
              </div>
            </div>
            <div className="space-y-1">
              {depth.asks.map((ask, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="grid grid-cols-3 gap-2 text-xs p-1.5 rounded bg-error/5 hover:bg-error/10 transition-colors"
                >
                  <span className="font-semibold text-error">
                    ₹{ask.price.toFixed(2)}
                  </span>
                  <span className="text-right text-text-high">{ask.quantity}</span>
                  <span className="text-right text-text-medium">{ask.orders}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
