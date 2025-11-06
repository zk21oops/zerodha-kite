import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Car, LogOut, Wallet, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  number: string;
  tagId: string;
  balance: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userStr));

    // Load vehicles from localStorage
    const vehiclesStr = localStorage.getItem("vehicles");
    if (vehiclesStr) {
      setVehicles(JSON.parse(vehiclesStr));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const totalBalance = vehicles.reduce((sum, vehicle) => sum + vehicle.balance, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-surface-elevated/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-high">QuickTag</h1>
                <p className="text-xs text-text-medium">FASTag Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-text-high">{user.name}</p>
                <p className="text-xs text-text-medium">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-slide-up space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-text-high mb-2">
              Welcome back, {user.name}
            </h2>
            <p className="text-text-medium">Manage your FASTag accounts and recharge seamlessly</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-medium">
                  Total Balance
                </CardTitle>
                <Wallet className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-high">₹{totalBalance.toFixed(2)}</div>
                <p className="text-xs text-text-medium mt-1">Across all vehicles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-medium">
                  Active Vehicles
                </CardTitle>
                <Car className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-high">{vehicles.length}</div>
                <p className="text-xs text-text-medium mt-1">Registered FASTags</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-medium">
                  Quick Recharge
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <Button 
                  variant="accent" 
                  className="w-full"
                  onClick={() => navigate("/vehicles")}
                  disabled={vehicles.length === 0}
                >
                  {vehicles.length === 0 ? "Add Vehicle First" : "Recharge Now"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Vehicles List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-text-high">Your Vehicles</h3>
              <Button variant="accent" onClick={() => navigate("/vehicles")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>

            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Car className="w-16 h-16 text-text-low mb-4" />
                  <h3 className="text-lg font-semibold text-text-high mb-2">No vehicles added yet</h3>
                  <p className="text-text-medium text-center mb-6">
                    Add your first vehicle to start managing your FASTag
                  </p>
                  <Button variant="accent" onClick={() => navigate("/vehicles")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Vehicle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="cursor-pointer" onClick={() => navigate(`/recharge/${vehicle.id}`)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-accent" />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vehicle.balance > 100 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        }`}>
                          {vehicle.balance > 100 ? "Active" : "Low Balance"}
                        </div>
                      </div>
                      <CardTitle className="mt-4">{vehicle.number}</CardTitle>
                      <CardDescription>Tag ID: {vehicle.tagId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-text-medium mb-1">Current Balance</p>
                          <p className="text-2xl font-bold text-text-high">₹{vehicle.balance.toFixed(2)}</p>
                        </div>
                        <Button variant="accent" className="w-full" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recharge/${vehicle.id}`);
                        }}>
                          Recharge Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
