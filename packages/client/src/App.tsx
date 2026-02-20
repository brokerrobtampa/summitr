import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header.js';
import { ProtectedRoute } from './components/auth/ProtectedRoute.js';
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

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/users/:username" element={<PublicProfilePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
