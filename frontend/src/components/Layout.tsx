import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, Newspaper, Bot, TrendingUp, FileText, Wallet, Clock, DollarSign, Gift, Calendar, BookOpen, Menu, X, ChevronRight } from "lucide-react";

export const Layout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      {/* Floating Toggle Button - Only visible when sidebar is closed */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-50 w-14 h-14 rounded-2xl gradient-purple-blue text-white shadow-premium-lg hover:opacity-90 hover-lift p-0 animate-fade-in"
        >
          <Menu className="w-6 h-6" />
        </Button>
      )}

      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
        className="text-white [--sidebar-width:20rem] gradient-purple-blue border-none shadow-2xl"
      >
        <SidebarRail className="bg-white/20" />

        {/* Close Button - Only visible when sidebar is open */}
        <div className="absolute right-4 top-4 z-10">
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all hover-lift"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <SidebarHeader className="p-6 pt-16">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              CLT Agora
            </h1>
            <p className="text-white/80 text-sm font-semibold pl-1">Direito Trabalhista Simplificado</p>
          </div>

          {/* AI Button Premium */}
          <Button
            className="w-full justify-start bg-white hover:bg-white/95 text-purple-700 border-none shadow-2xl font-bold h-14 rounded-2xl hover-lift group mb-2"
            asChild
          >
            <Link to="/ai-agent">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <Sparkles className="h-5 w-5 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-base">Pergunte à IA Celeste</span>
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent className="px-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/90 text-xs font-extrabold uppercase tracking-widest px-4 mb-4">
              Principal
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/">
                    <Home className="w-5 h-5 mr-1" />
                    <span>Início</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/news-feed"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/news-feed">
                    <Newspaper className="w-5 h-5 mr-1" />
                    <span>Notícias</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/ai-agent"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/ai-agent">
                    <Bot className="w-5 h-5 mr-1" />
                    <span>Assistente IA</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-white/90 text-xs font-extrabold uppercase tracking-widest px-4 mb-4">
              Ferramentas
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/vacation-calculator"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/vacation-calculator">
                    <TrendingUp className="w-5 h-5 mr-1" />
                    <span>Cálculo de Férias</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/termination-calculator"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/termination-calculator">
                    <FileText className="w-5 h-5 mr-1" />
                    <span>Cálculo de Rescisão</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/fgts-calculator"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/fgts-calculator">
                    <Wallet className="w-5 h-5 mr-1" />
                    <span>Calculadora FGTS</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/overtime-calculator"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/overtime-calculator">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>Horas Extras</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/net-salary-calculator"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/net-salary-calculator">
                    <DollarSign className="w-5 h-5 mr-1" />
                    <span>Salário Líquido</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/thirteenth-salary-calculator"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/thirteenth-salary-calculator">
                    <Gift className="w-5 h-5 mr-1" />
                    <span>13º Salário</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/work-calendar"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/work-calendar">
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>Calendário</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tools/glossary"}
                  className="h-12 text-white hover:bg-white/20 data-[active=true]:bg-white/30 rounded-2xl font-semibold transition-all hover-lift data-[active=true]:shadow-xl text-[15px]"
                >
                  <Link to="/tools/glossary">
                    <BookOpen className="w-5 h-5 mr-1" />
                    <span>Glossário</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
