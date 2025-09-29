import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Pencil, Bot, X } from "lucide-react";
import { AIChatWidget } from "@/components/AIChatWidget";

export const Layout = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="text-primary-foreground [--sidebar-width:18rem] bg-primary">
        <SidebarRail />
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <Button variant="default" className="w-full justify-start" asChild>
              <Link to="/ai-agent">
                <Pencil className="mr-2 h-4 w-4" />
                Nova conversa
              </Link>
            </Button>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel asChild className="hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <Link to="/">Principal</Link>
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/news-feed"}>
                  <Link to="/news-feed">Feed de Notícias</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/ai-agent"}>
                  <Link to="/ai-agent">Agente IA</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel asChild className="hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <Link to="/tools">Ferramentas</Link>
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/tools/vacation-calculator"}>
                  <Link to="/tools/vacation-calculator">Cálculo de Férias</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/tools/termination-calculator"}>
                  <Link to="/tools/termination-calculator">Cálculo de Rescisão</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/tools/glossary"}>
                  <Link to="/tools/glossary">Glossário</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:hidden">
          <div className="flex items-center gap-2">
            <img src="/clt-favicon.svg" alt="CLT Agora Logo" className="w-6 h-6" />
            <h1 className="text-lg font-semibold">CLT Agora</h1>
          </div>
          <SidebarTrigger />
        </header>
        <Outlet />
        {location.pathname !== "/ai-agent" && (
          <>
            <Button 
              className="rounded-full w-16 h-16 fixed bottom-8 right-8 shadow-lg z-50" 
              size="lg"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              {isChatOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
            </Button>
            {isChatOpen && <AIChatWidget onClose={() => setIsChatOpen(false)} />}
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};
