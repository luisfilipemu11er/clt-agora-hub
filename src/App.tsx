import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewsFeed } from "./pages/NewsFeed";
import { NewsDetail } from "./pages/NewsDetail";
import { Tools } from "./pages/Tools";
import { VacationCalculator } from "./pages/VacationCalculator";
import { Glossary } from "./pages/Glossary";
import { Search } from "./pages/Search";
import { AIAgent } from "./pages/AIAgent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewsFeed />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/vacation-calculator" element={<VacationCalculator />} />
          <Route path="/tools/glossary" element={<Glossary />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ai-agent" element={<AIAgent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
