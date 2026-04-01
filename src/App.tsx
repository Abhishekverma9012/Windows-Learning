import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Safety from "./pages/Safety";
import FAQ from "./pages/FAQ";
import HowItWorksPage from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";

// Onboarding
import LearnerOnboarding from "./pages/LearnerOnboarding";
import MentorOnboarding from "./pages/MentorOnboarding";
import MentorVerificationPending from "./pages/MentorVerificationPending";

// Learner pages
import LearnerDashboard from "./pages/LearnerDashboard";
import LearnerSessions from "./pages/LearnerSessions";
import LearnerProgress from "./pages/LearnerProgress";
import LearnerWallet from "./pages/LearnerWallet";
import LearnerProfileEdit from "./pages/LearnerProfileEdit";
import PostRequirement from "./pages/PostRequirement";

// Mentor pages
import MentorDashboard from "./pages/MentorDashboard";
import MentorRequests from "./pages/MentorRequests";
import MentorProposals from "./pages/MentorProposals";
import MentorSessions from "./pages/MentorSessions";
import MentorEarnings from "./pages/MentorEarnings";
import MentorAvailability from "./pages/MentorAvailability";
import MentorProfileEdit from "./pages/MentorProfileEdit";
import MentorProfile from "./pages/MentorProfile";

// Discovery
import BrowseMentors from "./pages/BrowseMentors";

// Support
import HelpCenter from "./pages/HelpCenter";
import SupportTicket from "./pages/SupportTicket";
import SettingsPage from "./pages/Settings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />

            {/* Onboarding */}
            <Route path="/onboarding/learner" element={<LearnerOnboarding />} />
            <Route path="/onboarding/mentor" element={<MentorOnboarding />} />
            <Route path="/mentor/verification-pending" element={<MentorVerificationPending />} />

            {/* Learner */}
            <Route path="/dashboard" element={<LearnerDashboard />} />
            <Route path="/dashboard/learner" element={<LearnerDashboard />} />
            <Route path="/learner/sessions" element={<LearnerSessions />} />
            <Route path="/learner/progress" element={<LearnerProgress />} />
            <Route path="/learner/wallet" element={<LearnerWallet />} />
            <Route path="/learner/profile/edit" element={<LearnerProfileEdit />} />
            <Route path="/requirements/post" element={<PostRequirement />} />

            {/* Mentor */}
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/dashboard/mentor" element={<MentorDashboard />} />
            <Route path="/mentor/requests" element={<MentorRequests />} />
            <Route path="/mentor/requests/:id" element={<MentorRequests />} />
            <Route path="/mentor/proposals" element={<MentorProposals />} />
            <Route path="/mentor/sessions" element={<MentorSessions />} />
            <Route path="/mentor/earnings" element={<MentorEarnings />} />
            <Route path="/mentor/availability" element={<MentorAvailability />} />
            <Route path="/mentor/profile/edit" element={<MentorProfileEdit />} />
            <Route path="/mentor/:id" element={<MentorProfile />} />

            {/* Discovery */}
            <Route path="/mentors" element={<BrowseMentors />} />

            {/* Support & Settings */}
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/support/ticket" element={<SupportTicket />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
