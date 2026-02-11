import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import ResearchView from './pages/ResearchView';
import Methodology from './pages/Methodology';
import Login from './pages/Admin/Login';
import Editor from './pages/Admin/Editor';
import Dashboard from './pages/Admin/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="research/:slug" element={<ResearchView />} />
          <Route path="methodology" element={<Methodology />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Admin Routes (Standalone) */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/editor" element={<Editor />} />
        <Route path="/admin/editor/:slug" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
