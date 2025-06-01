import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuthStore } from './store/authStore';
import { useAppStore } from './store/appStore';

// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KidsDashboard from './pages/KidsDashboard';
import ParentDashboard from './pages/ParentDashboard';
import GamesPage from './pages/GamesPage';
import StoriesPage from './pages/StoriesPage';
import PricingPage from './pages/PricingPage';
import GamePlayPage from './pages/GamePlayPage';
import StoryReadPage from './pages/StoryReadPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Role-based Route Component
const RoleRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'child' ? '/kids-dashboard' : '/parent-dashboard'} />;
  }
  
  return <>{children}</>;
};

function App() {
  const { theme } = useAppStore();

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/kids-dashboard" element={
              <RoleRoute allowedRoles={['child']}>
                <Layout>
                  <KidsDashboard />
                </Layout>
              </RoleRoute>
            } />
            
            <Route path="/parent-dashboard" element={
              <RoleRoute allowedRoles={['parent']}>
                <Layout>
                  <ParentDashboard />
                </Layout>
              </RoleRoute>
            } />
            
            <Route path="/games" element={
              <ProtectedRoute>
                <Layout>
                  <GamesPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/games/:gameId" element={
              <ProtectedRoute>
                <Layout>
                  <GamePlayPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/stories" element={
              <ProtectedRoute>
                <Layout>
                  <StoriesPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/stories/:storyId" element={
              <ProtectedRoute>
                <Layout>
                  <StoryReadPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
        
        <Toaster position="top-right" richColors />
      </div>
    </ErrorBoundary>
  );
}

export default App;
