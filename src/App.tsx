import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import ResearchView from './pages/ResearchView';
import Methodology from './pages/Methodology';
import Spinner from './components/Spinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load admin routes for better performance
const Login = lazy(() => import('./pages/Admin/Login'));
const Editor = lazy(() => import('./pages/Admin/Editor'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AnalyticsDashboard = lazy(() => import('./pages/Admin/AnalyticsDashboard'));

import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="research/:slug" element={<ResearchView />} />
            <Route path="methodology" element={<Methodology />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Admin Routes (Lazy Loaded) */}
          <Route path="/admin" element={
            <Suspense fallback={<Spinner />}>
              <Login />
            </Suspense>
          } />
          <Route path="/admin/dashboard" element={
            <Suspense fallback={<Spinner />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/admin/analytics" element={
            <Suspense fallback={<Spinner />}>
              <AnalyticsDashboard />
            </Suspense>
          } />
          <Route path="/admin/editor" element={
            <Suspense fallback={<Spinner />}>
              <Editor />
            </Suspense>
          } />
          <Route path="/admin/editor/:slug" element={
            <Suspense fallback={<Spinner />}>
              <Editor />
            </Suspense>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
