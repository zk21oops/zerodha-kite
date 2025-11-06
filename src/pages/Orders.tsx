import { TradingSidebar } from "@/components/trading/TradingSidebar";
import { TradingHeader } from "@/components/trading/TradingHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { useOrders } from "@/hooks/useTradingData";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { orders, cancelOrder } = useOrders();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-success/10 text-success hover:bg-success/20";
      case "PENDING":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "REJECTED":
        return "bg-error/10 text-error hover:bg-error/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-background rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-text-high">{order.symbol}</p>
                      <p className="text-sm text-text-medium">
                        {order.id} • {order.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={order.type === "BUY" ? "default" : "destructive"}
                      >
                        {order.type}
                      </Badge>
                      <div className="text-right">
                        <p className="font-semibold">{order.quantity} @ ₹{order.price}</p>
                        <p className="text-sm text-text-medium">
                          Total: ₹{(order.quantity * order.price).toFixed(2)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      {order.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const success = await cancelOrder(order.id);
                            if (success) {
                              toast({
                                title: "Order Cancelled",
                                description: `Order ${order.id} has been cancelled`,
                              });
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
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
