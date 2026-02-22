import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header.js';
import { Footer } from './components/layout/Footer.js';
import { ProtectedRoute } from './components/auth/ProtectedRoute.js';
import { WebSocketProvider } from './context/WebSocketContext.js';
import { HomePage } from './pages/HomePage.js';
import { ExplorePage } from './pages/ExplorePage.js';
import { PeaksPage } from './pages/PeaksPage.js';
import { PeakDetailPage } from './pages/PeakDetailPage.js';
import { RoutesPage } from './pages/RoutesPage.js';
import { RouteDetailPage } from './pages/RouteDetailPage.js';
import { CreateRoutePage } from './pages/CreateRoutePage.js';
import { GuidedPeaksPage } from './pages/GuidedPeaksPage.js';
import { GuideDirectoryPage } from './pages/GuideDirectoryPage.js';
import { GuideProfilePage } from './pages/GuideProfilePage.js';
import { GuideCompanyPage } from './pages/GuideCompanyPage.js';
import { SearchResultsPage } from './pages/SearchResultsPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { PublicProfilePage } from './pages/PublicProfilePage.js';
import { FeedPage } from './pages/FeedPage.js';
import { NotificationsPage } from './pages/NotificationsPage.js';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.js';
import { ResetPasswordPage } from './pages/ResetPasswordPage.js';
import { ForumsPage } from './pages/ForumsPage.js';
import { ForumCategoryPage } from './pages/ForumCategoryPage.js';
import { ForumThreadPage } from './pages/ForumThreadPage.js';
import { TripPlannerPage } from './pages/TripPlannerPage.js';

export default function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/peaks" element={<PeaksPage />} />
              <Route path="/peaks/:id" element={<PeakDetailPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/routes/new" element={
                <ProtectedRoute><CreateRoutePage /></ProtectedRoute>
              } />
              <Route path="/routes/:id" element={<RouteDetailPage />} />
              <Route path="/guided" element={<GuidedPeaksPage />} />
              <Route path="/guides" element={<GuideDirectoryPage />} />
              <Route path="/guides/:id" element={<GuideProfilePage />} />
              <Route path="/guides/companies/:id" element={<GuideCompanyPage />} />
              <Route path="/trip-planner" element={<TripPlannerPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/forums" element={<ForumsPage />} />
              <Route path="/forums/threads/:threadId" element={<ForumThreadPage />} />
              <Route path="/forums/:slug" element={<ForumCategoryPage />} />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/users/:username" element={<PublicProfilePage />} />
              <Route path="/notifications" element={
                <ProtectedRoute><NotificationsPage /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </WebSocketProvider>
    </BrowserRouter>
  );
}
