import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";

const timeframes = ["1m", "5m", "15m", "1h", "1D", "1W"];

const mockData = Array.from({ length: 50 }, (_, i) => ({
  time: i,
  price: 2850 + Math.random() * 100 - 50 + i * 0.5,
  volume: Math.random() * 1000000,
}));

interface ChartSectionProps {
  symbol?: string;
  ltp?: number;
  change?: number;
  changePercent?: number;
}

export function ChartSection({
  symbol = "NIFTY 50",
  ltp = 21850.45,
  change = 125.30,
  changePercent = 0.58,
}: ChartSectionProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const isPositive = change >= 0;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        {/* Stock Info Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-high">{symbol}</h2>
            <div className="flex items-center gap-4">
              <motion.span
                key={ltp}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-text-high"
              >
                ₹{ltp.toFixed(2)}
              </motion.span>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {isPositive ? "+" : ""}
                  {change.toFixed(2)} ({changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={timeframe} onValueChange={setTimeframe}>
              <TabsList className="bg-background">
                {timeframes.map((tf) => (
                  <TabsTrigger
                    key={tf}
                    value={tf}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {tf}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="icon">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? "#10B981" : "#EF4444"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? "#10B981" : "#EF4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                tickLine={false}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                tickLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                fill="url(#colorPrice)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Indicators */}
        <div className="mt-4 flex gap-2">
          {["SMA", "EMA", "RSI", "MACD"].map((indicator) => (
            <Button key={indicator} variant="outline" size="sm">
              {indicator}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
