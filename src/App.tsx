import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout"; // Import Layout
import { Home } from "./pages/Home";
import { NewsFeed } from "./pages/NewsFeed";
import { NewsDetail } from "./pages/NewsDetail";
import { Tools } from "./pages/Tools";
import VacationCalculatorPage from "./pages/VacationCalculatorPage";
import { TerminationCalculator } from "./pages/TerminationCalculator";
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
          <Route element={<Layout />}> {/* Wrap routes in Layout */}
            <Route path="/" element={<Home />} />
            <Route path="/news-feed" element={<NewsFeed />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/vacation-calculator" element={<VacationCalculatorPage />} />
            <Route path="/tools/termination-calculator" element={<TerminationCalculator />} />
            <Route path="/tools/glossary" element={<Glossary />} />
            <Route path="/search" element={<Search />} />
            <Route path="/ai-agent" element={<AIAgent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
