import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowLeft, Car, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  number: string;
  tagId: string;
  balance: number;
}

const quickAmounts = [100, 200, 500, 1000, 2000];

const Recharge = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/");
      return;
    }

    // Load vehicle
    const vehiclesStr = localStorage.getItem("vehicles");
    if (vehiclesStr) {
      const vehicles: Vehicle[] = JSON.parse(vehiclesStr);
      const foundVehicle = vehicles.find(v => v.id === vehicleId);
      if (foundVehicle) {
        setVehicle(foundVehicle);
      } else {
        toast.error("Vehicle not found");
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  }, [vehicleId, navigate]);

  const handleRecharge = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const rechargeAmount = parseFloat(amount);
    if (!rechargeAmount || rechargeAmount < 50) {
      toast.error("Minimum recharge amount is ₹50");
      return;
    }

    if (rechargeAmount > 10000) {
      toast.error("Maximum recharge amount is ₹10,000");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update vehicle balance
    const vehiclesStr = localStorage.getItem("vehicles");
    if (vehiclesStr && vehicle) {
      const vehicles: Vehicle[] = JSON.parse(vehiclesStr);
      const updatedVehicles = vehicles.map(v => 
        v.id === vehicle.id 
          ? { ...v, balance: v.balance + rechargeAmount }
          : v
      );
      localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
      
      setVehicle({ ...vehicle, balance: vehicle.balance + rechargeAmount });
      setSuccess(true);
      setProcessing(false);
      
      toast.success(`Successfully recharged ₹${rechargeAmount}`);
    }
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  if (!vehicle) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text-high mb-2">Recharge Successful!</h2>
            <p className="text-text-medium mb-6">
              Your FASTag has been recharged successfully
            </p>
            
            <div className="bg-surface rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-medium">Vehicle</span>
                <span className="font-medium text-text-high">{vehicle.number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-medium">Amount Recharged</span>
                <span className="font-medium text-text-high">₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-medium">New Balance</span>
                <span className="font-bold text-success">₹{vehicle.balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="accent" 
                className="w-full"
                onClick={() => {
                  setSuccess(false);
                  setAmount("");
                }}
              >
                Recharge Again
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-surface-elevated/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-high">Recharge FASTag</h1>
                <p className="text-xs text-text-medium">Complete your payment</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto animate-fade-slide-up space-y-6">
          {/* Vehicle Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Car className="w-7 h-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-high">{vehicle.number}</h3>
                  <p className="text-sm text-text-medium">Tag ID: {vehicle.tagId}</p>
                  <div className="mt-3 inline-block bg-surface px-3 py-1 rounded-lg">
                    <p className="text-xs text-text-medium">Current Balance</p>
                    <p className="text-lg font-bold text-text-high">₹{vehicle.balance.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recharge Form */}
          <Card>
            <CardHeader>
              <CardTitle>Recharge Amount</CardTitle>
              <CardDescription>Select or enter the amount you want to recharge</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRecharge} className="space-y-6">
                {/* Quick Amount Buttons */}
                <div className="space-y-2">
                  <Label>Quick Select</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        type="button"
                        variant={amount === quickAmount.toString() ? "accent" : "outline"}
                        onClick={() => handleQuickAmount(quickAmount)}
                        className="h-12"
                      >
                        ₹{quickAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Custom Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount (₹50 - ₹10,000)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="50"
                    max="10000"
                    className="h-12 text-lg"
                  />
                  <p className="text-xs text-text-medium">
                    Minimum: ₹50 | Maximum: ₹10,000
                  </p>
                </div>

                {/* Summary */}
                {amount && parseFloat(amount) >= 50 && (
                  <div className="bg-surface rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-medium">Recharge Amount</span>
                      <span className="font-medium text-text-high">₹{parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-medium">Current Balance</span>
                      <span className="font-medium text-text-high">₹{vehicle.balance.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between">
                      <span className="font-medium text-text-high">New Balance</span>
                      <span className="font-bold text-accent">
                        ₹{(vehicle.balance + parseFloat(amount)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="accent" 
                  size="lg"
                  className="w-full"
                  disabled={!amount || parseFloat(amount) < 50 || processing}
                >
                  {processing ? "Processing..." : `Pay ₹${amount || "0"}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Recharge;
