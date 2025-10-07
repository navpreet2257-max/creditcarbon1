import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { ProductsPage } from "./pages/ProductsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App" style={{ backgroundColor: 'var(--bg-page)' }}>
      <BrowserRouter>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;