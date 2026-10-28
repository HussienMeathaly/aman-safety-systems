import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Gallery from "./pages/Gallery.tsx";
import NotFound from "./pages/NotFound.tsx";
import DesignService from "./pages/services/DesignService.tsx";
import SupervisionService from "./pages/services/SupervisionService.tsx";
import SafetyService from "./pages/services/SafetyService.tsx";
import TechnicalService from "./pages/services/TechnicalService.tsx";
import TrafficService from "./pages/services/TrafficService.tsx";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const scrollToEl = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      };
      // retry a few times in case the target section renders after navigation
      scrollToEl();
      const t1 = setTimeout(scrollToEl, 150);
      const t2 = setTimeout(scrollToEl, 400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/profile" element={<Navigate to="/#profile" replace />} />
          <Route path="/service-request" element={<Navigate to="/#contact" replace />} />
          <Route path="/services/design" element={<DesignService />} />
          <Route path="/services/supervision" element={<SupervisionService />} />
          <Route path="/services/safety" element={<SafetyService />} />
          <Route path="/services/technical" element={<TechnicalService />} />
          <Route path="/services/traffic" element={<TrafficService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
