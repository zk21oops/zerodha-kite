import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowLeft, Car, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  number: string;
  tagId: string;
  balance: number;
}

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    tagId: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/");
      return;
    }

    // Load vehicles
    const vehiclesStr = localStorage.getItem("vehicles");
    if (vehiclesStr) {
      setVehicles(JSON.parse(vehiclesStr));
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number || !formData.tagId) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate vehicle number format (basic validation)
    const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
    if (!vehicleRegex.test(formData.number.toUpperCase().replace(/\s/g, ''))) {
      toast.error("Invalid vehicle number format (e.g., MH12AB1234)");
      return;
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      number: formData.number.toUpperCase(),
      tagId: formData.tagId,
      balance: 100, // Initial balance
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));

    toast.success("Vehicle added successfully!");
    setFormData({ number: "", tagId: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    setVehicles(updatedVehicles);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
    toast.success("Vehicle removed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-surface-elevated/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text-high">Vehicle Management</h1>
                  <p className="text-xs text-text-medium">Add and manage your vehicles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto animate-fade-slide-up space-y-8">
          {/* Add Vehicle Section */}
          {!showForm ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Vehicles</CardTitle>
                    <CardDescription>Manage all your registered FASTags</CardDescription>
                  </div>
                  <Button variant="accent" onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Add New Vehicle</CardTitle>
                <CardDescription>Enter your vehicle and FASTag details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Vehicle Number</Label>
                    <Input
                      id="number"
                      type="text"
                      placeholder="MH12AB1234"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="h-11 uppercase"
                      maxLength={10}
                    />
                    <p className="text-xs text-text-medium">Format: MH12AB1234 (without spaces)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagId">FASTag ID</Label>
                    <Input
                      id="tagId"
                      type="text"
                      placeholder="Enter your FASTag ID"
                      value={formData.tagId}
                      onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" variant="accent" className="flex-1">
                      Add Vehicle
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {
                      setShowForm(false);
                      setFormData({ number: "", tagId: "" });
                    }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Vehicles List */}
          {vehicles.length > 0 && (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-text-high">{vehicle.number}</h3>
                          <p className="text-sm text-text-medium">Tag ID: {vehicle.tagId}</p>
                          <div className="mt-3 flex items-center gap-4">
                            <div>
                              <p className="text-xs text-text-medium">Balance</p>
                              <p className="text-lg font-bold text-text-high">₹{vehicle.balance.toFixed(2)}</p>
                            </div>
                            <Button 
                              variant="accent" 
                              size="sm"
                              onClick={() => navigate(`/recharge/${vehicle.id}`)}
                            >
                              Recharge
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {vehicles.length === 0 && !showForm && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Car className="w-16 h-16 text-text-low mb-4" />
                <h3 className="text-lg font-semibold text-text-high mb-2">No vehicles added yet</h3>
                <p className="text-text-medium text-center mb-6">
                  Add your first vehicle to start managing your FASTag
                </p>
                <Button variant="accent" onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vehicles;
