import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Shield } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isLogin && !formData.name) {
      toast.error("Please enter your name");
      return;
    }

    // Store user info
    localStorage.setItem("user", JSON.stringify({ 
      name: formData.name || "User",
      email: formData.email 
    }));
    
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4 animate-fade-slide-up">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="hidden lg:block space-y-6 animate-fade-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-text-high">QuickTag</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-text-high leading-tight">
              Seamless FASTag <br />
              <span className="text-primary">Recharge Experience</span>
            </h2>
            <p className="text-lg text-text-medium">
              Manage your FASTag accounts with ease. Quick recharges, multiple vehicles, and instant confirmations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-text-high">Secure Payments</h3>
              <p className="text-sm text-text-medium">Bank-grade encryption for all transactions</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-text-high">Instant Recharge</h3>
              <p className="text-sm text-text-medium">Credits added to your account immediately</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto lg:mx-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Enter your credentials to access your account" 
                : "Sign up to start managing your FASTag"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" variant="accent">
                {isLogin ? "Sign in" : "Create account"}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
