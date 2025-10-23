import { Home, Wrench, Search, Bot } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: Wrench, label: "Ferramentas", path: "/tools" },
    { icon: Search, label: "Buscar", path: "/search" },
    { icon: Bot, label: "IA", path: "/ai-agent" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 px-4 py-2 shadow-elevated md:hidden">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};