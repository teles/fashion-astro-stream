
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ApiProvider } from "./services/api-context";
import { ThemeProvider } from "./hooks/use-theme";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WebsiteSchema from "./components/WebsiteSchema";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Post = lazy(() => import("./pages/Post"));
const Category = lazy(() => import("./pages/Category"));
const Search = lazy(() => import("./pages/Search"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <WebsiteSchema url="https://seamodapega.com.br" />
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin h-8 w-8 border-4 border-fashion-primary border-t-transparent rounded-full"></div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/:slug" element={<Post />} />
                    <Route path="/categoria/:slug" element={<Category />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ApiProvider>
  </QueryClientProvider>
);

export default App;
