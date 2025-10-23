import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Newspaper, Wrench, Bot, Search } from "lucide-react";

const menuItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/news-feed", icon: Newspaper, label: "Notícias" },
  { to: "/tools", icon: Wrench, label: "Ferramentas" },
  { to: "/ai-agent", icon: Bot, label: "Agente IA" },
  { to: "/search", icon: Search, label: "Busca" },
];

export const NavMenu = () => {
  const location = useLocation();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.to}>
          <SidebarMenuButton
            asChild
            isActive={location.pathname === item.to}
            tooltip={item.label}
            className="data-[active=true]:bg-primary-dark" // Custom active style
          >
            <NavLink to={item.to}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
