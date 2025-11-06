import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFunds } from "@/hooks/useTradingData";
import { Plus, ArrowDownToLine } from "lucide-react";
import { motion } from "framer-motion";

export function FundsPanel() {
  const funds = useFunds();

  const fundItems = [
    { label: "Opening Balance", value: funds.openingBalance, highlight: false },
    { label: "Available Cash", value: funds.availableCash, highlight: true },
    { label: "Used Margin", value: funds.usedMargin, highlight: false },
    { label: "Available Margin", value: funds.availableMargin, highlight: true },
    { label: "Total Collateral", value: funds.totalCollateral, highlight: false },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Funds</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Funds
          </Button>
          <Button variant="outline" size="sm">
            <ArrowDownToLine className="w-4 h-4 mr-1" />
            Withdraw
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {fundItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex justify-between items-center p-3 rounded-lg ${
              item.highlight ? "bg-primary/5 border border-primary/20" : "bg-background"
            }`}
          >
            <span
              className={`text-sm ${
                item.highlight ? "font-semibold text-text-high" : "text-text-medium"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`font-bold ${
                item.highlight ? "text-primary text-lg" : "text-text-high"
              }`}
            >
              ₹{item.value.toFixed(2)}
            </span>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
