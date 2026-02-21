import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header.js';
import { ProtectedRoute } from './components/auth/ProtectedRoute.js';
import { WebSocketProvider } from './context/WebSocketContext.js';
import { HomePage } from './pages/HomePage.js';
import { ExplorePage } from './pages/ExplorePage.js';
import { PeakDetailPage } from './pages/PeakDetailPage.js';
import { RouteDetailPage } from './pages/RouteDetailPage.js';
import { CreateRoutePage } from './pages/CreateRoutePage.js';
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

export default function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/peaks/:id" element={<PeakDetailPage />} />
            <Route path="/routes/:id" element={<RouteDetailPage />} />
            <Route path="/routes/new" element={
              <ProtectedRoute><CreateRoutePage /></ProtectedRoute>
            } />
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
      </WebSocketProvider>
    </BrowserRouter>
  );
}
