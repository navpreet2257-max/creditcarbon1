import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { ProductsPage } from "./pages/ProductsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App" style={{ backgroundColor: 'var(--bg-page)' }}>
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
