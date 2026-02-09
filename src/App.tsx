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

          {/* Admin Routes */}
          <Route path="admin" element={<div className="pt-24"><Login /></div>} />
          <Route path="admin/dashboard" element={<div className="pt-0"><Dashboard /></div>} />
          <Route path="admin/editor" element={<div className="pt-0"><Editor /></div>} />
          <Route path="admin/editor/:slug" element={<div className="pt-0"><Editor /></div>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
