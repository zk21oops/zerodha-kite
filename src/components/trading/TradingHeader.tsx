import { Bell, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function TradingHeader() {
  return (
    <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-medium" />
            <Input
              placeholder="Search stocks, ETFs, mutual funds..."
              className="pl-10 bg-background/50 border-border"
            />
          </div>
        </div>

        {/* Market Status & Actions */}
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-success/10 rounded-lg"
          >
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success">Market Open</span>
          </motion.div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
          </Button>

          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
