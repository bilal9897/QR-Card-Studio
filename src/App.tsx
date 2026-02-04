import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useScreenshotProtection } from "@/hooks/useScreenshotProtection";
import Home from "./pages/Home";
// Lazy load components that depend on Firebase to prevent crash if keys are missing
const Generator = lazy(() => import("./pages/Generator"));
const Templates = lazy(() => import("./pages/Templates"));
const About = lazy(() => import("./pages/About"));
const PrintPreview = lazy(() => import("./pages/PrintPreview"));
const Install = lazy(() => import("./pages/Install"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RedirectHandler = lazy(() => import("./pages/RedirectHandler"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));

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
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/create" element={<Generator />} />
              <Route path="/about" element={<About />} />
              <Route path="/print-preview" element={<PrintPreview />} />
              <Route path="/install" element={<Install />} />
              <Route path="/r/:id" element={<RedirectHandler />} />
              <Route path="/analytics/:id" element={<AnalyticsDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
