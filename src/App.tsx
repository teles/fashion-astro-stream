
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ApiProvider } from "./services/api-context";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Post from "./pages/Post";
import Category from "./pages/Category";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import WebsiteSchema from "./components/WebsiteSchema";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <WebsiteSchema url="https://seamodapega.com.br" />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/post/:slug" element={<Post />} />
                <Route path="/categoria/:slug" element={<Category />} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ApiProvider>
  </QueryClientProvider>
);

export default App;
