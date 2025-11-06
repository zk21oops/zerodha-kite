import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useTradingData";

type OrderType = "MARKET" | "LIMIT" | "SL" | "SL-M";

interface OrderPanelProps {
  symbol?: string;
  currentPrice?: number;
}

export function OrderPanel({ symbol = "NIFTY 50", currentPrice = 21850.45 }: OrderPanelProps) {
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(currentPrice);
  const [triggerPrice, setTriggerPrice] = useState(currentPrice - 50);
  const { toast } = useToast();
  const { placeOrder } = useOrders();

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleOrder = async (action: "BUY" | "SELL") => {
    try {
      const order = await placeOrder({
        symbol,
        type: action,
        orderType,
        quantity,
        price: orderType !== "MARKET" && orderType !== "SL-M" ? price : undefined,
        triggerPrice: orderType === "SL" || orderType === "SL-M" ? triggerPrice : undefined,
      });

      toast({
        title: `${action} Order ${order.status === "COMPLETED" ? "Executed" : "Placed"}`,
        description: `${quantity} x ${symbol} at ₹${order.price.toFixed(2)}`,
        variant: action === "BUY" ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Place Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Type */}
        <div className="space-y-2">
          <Label>Order Type</Label>
          <Tabs value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
            <TabsList className="w-full bg-background">
              <TabsTrigger value="MARKET" className="flex-1">
                Market
              </TabsTrigger>
              <TabsTrigger value="LIMIT" className="flex-1">
                Limit
              </TabsTrigger>
              <TabsTrigger value="SL" className="flex-1">
                SL
              </TabsTrigger>
              <TabsTrigger value="SL-M" className="flex-1">
                SL-M
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label>Quantity</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Price (if not MARKET) */}
        {orderType !== "MARKET" && orderType !== "SL-M" && (
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              step="0.05"
            />
          </div>
        )}

        {/* Trigger Price (for SL orders) */}
        {(orderType === "SL" || orderType === "SL-M") && (
          <div className="space-y-2">
            <Label>Trigger Price</Label>
            <Input
              type="number"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
              step="0.05"
            />
          </div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-background rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-medium">Quantity</span>
            <span className="font-semibold">{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-medium">Price</span>
            <span className="font-semibold">₹{price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="text-text-medium">Total Value</span>
            <span className="font-bold text-text-high">
              ₹{(quantity * price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleOrder("BUY")}
              className="w-full bg-success hover:bg-success/90 text-white font-semibold"
            >
              BUY
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleOrder("SELL")}
              variant="destructive"
              className="w-full font-semibold"
            >
              SELL
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
