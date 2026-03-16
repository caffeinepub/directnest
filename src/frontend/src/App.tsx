import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileNav from "./components/MobileNav";
import Navbar from "./components/Navbar";
import { AppProvider } from "./context/AppContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AgentProfilePage from "./pages/AgentProfilePage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import MessagingPage from "./pages/MessagingPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import SavedPropertiesPage from "./pages/SavedPropertiesPage";
import SearchPage from "./pages/SearchPage";
import UploadPropertyPage from "./pages/UploadPropertyPage";
import UserProfilePage from "./pages/UserProfilePage";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar />
      <main>{children}</main>
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <Layout>
                <LandingPage />
              </Layout>
            }
          />
          <Route
            path="/home"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/search"
            element={
              <Layout>
                <SearchPage />
              </Layout>
            }
          />
          <Route
            path="/property/:id"
            element={
              <Layout>
                <PropertyDetailPage />
              </Layout>
            }
          />
          <Route
            path="/upload"
            element={
              <Layout>
                <UploadPropertyPage />
              </Layout>
            }
          />
          <Route
            path="/messages"
            element={
              <Layout>
                <MessagingPage />
              </Layout>
            }
          />
          <Route
            path="/agent/:id"
            element={
              <Layout>
                <AgentProfilePage />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <UserProfilePage />
              </Layout>
            }
          />
          <Route
            path="/saved"
            element={
              <Layout>
                <SavedPropertiesPage />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminDashboardPage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
