import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, ListOrdered, Wallet, TrendingUp, Eye, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: ListOrdered, label: "Orders", path: "/orders" },
  { icon: Wallet, label: "Holdings", path: "/holdings" },
  { icon: TrendingUp, label: "Positions", path: "/positions" },
  { icon: Eye, label: "Watchlist", path: "/watchlist" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
];

interface TradingSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function TradingSidebar({ collapsed, onToggle }: TradingSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative h-screen bg-surface border-r border-border flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">TradeHub</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all",
              "text-text-medium hover:bg-sidebar-accent hover:text-text-high",
              collapsed && "justify-center"
            )}
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Portfolio Summary (if not collapsed) */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t border-border"
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-medium">Total Value</span>
                <span className="font-semibold text-text-high">₹2,45,680</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-medium">Day P&L</span>
                <span className="font-semibold text-success">+₹4,250</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
