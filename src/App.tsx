import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScreenshotProtection } from "@/hooks/useScreenshotProtection";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
import Templates from "./pages/Templates";
import About from "./pages/About";
import PrintPreview from "./pages/PrintPreview";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import RedirectHandler from "./pages/RedirectHandler"; // Added import
import AnalyticsDashboard from "./pages/AnalyticsDashboard"; // Added import

const queryClient = new QueryClient();

const App = () => {
  // Enable screenshot protection
  useScreenshotProtection();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/create" element={<Generator />} />
            <Route path="/about" element={<About />} />
            <Route path="/print-preview" element={<PrintPreview />} />
            <Route path="/install" element={<Install />} />
            {/* ADDED NEW ROUTES */}
            <Route path="/r/:id" element={<RedirectHandler />} />
            <Route path="/analytics/:id" element={<AnalyticsDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
