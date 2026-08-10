import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import HomePage from "@/pages/HomePage";
import AttorneysPage from "@/pages/AttorneysPage";
import MemberProfilePage from "@/pages/MemberProfilePage";
import SitemapPage from "@/pages/SitemapPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import OfficePage from "@/pages/OfficePage";
import HistoryPage from "@/pages/HistoryPage";
import EventsPage from "@/pages/EventsPage";
import PracticeAreasPage from "@/pages/PracticeAreasPage";
import ResearchCoHelperPage from "@/pages/ResearchCoHelperPage";
import CareersPage from "@/pages/CareersPage";
import ContactPage from "@/pages/ContactPage";
import UnderConstruction from "@/pages/UnderConstruction";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function ProtectedOfficeRoute({ params }: { params: { officeId: string } }) {
  const { firmUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firmUser) {
    return <Redirect to="/login" />;
  }

  if (firmUser.officeId !== params.officeId) {
    return <Redirect to={`/office/${firmUser.officeId}`} />;
  }

  return <OfficePage />;
}

function GenericOfficeRoute() {
  const { firmUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400 uppercase tracking-widest">Loading Office...</p>
        </div>
      </div>
    );
  }

  if (!firmUser) {
    return <Redirect to="/login" />;
  }

  return <Redirect to={`/office/${firmUser.officeId || "counsel"}`} />;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/attorneys" component={AttorneysPage} />
        <Route path="/attorneys/:slug" component={MemberProfilePage} />
        <Route path="/members/:slug" component={MemberProfilePage} />
        <Route path="/sitemap" component={SitemapPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/onboard" component={RegisterPage} />
        <Route path="/office" component={GenericOfficeRoute} />
        <Route path="/office/:officeId" component={ProtectedOfficeRoute} />
        <Route path="/desk" component={ResearchCoHelperPage} />
        <Route path="/research" component={ResearchCoHelperPage} />
        <Route path="/research-cohelper" component={ResearchCoHelperPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/news" component={EventsPage} />
        <Route path="/services" component={PracticeAreasPage} />
        <Route path="/practice-areas" component={PracticeAreasPage} />
        <Route path="/careers" component={CareersPage} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  const baseUrl = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
  return (
    <AuthProvider>
      <WouterRouter base={baseUrl}>
        <Router />
      </WouterRouter>
    </AuthProvider>
  );
}

export default App;
