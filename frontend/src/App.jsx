import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import QuestionDetail from './pages/QuestionDetail'
import EditQuestion from './pages/Admin/EditQuestion'
import LoginModal from './components/LoginModal'
import TopicPath from './components/TopicPath'
import { AuthProvider } from './context/AuthContext'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // If no token, the interceptor/context will eventually catch 401s or we can dispatch here
  if (!token) {
    window.dispatchEvent(new CustomEvent('LOGIN_REQUIRED'));
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Client Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<Home />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/topic/:id" element={<TopicPath />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/questions/new" element={
          <PrivateRoute>
            <EditQuestion />
          </PrivateRoute>
        } />
        <Route path="/admin/questions/edit/:id" element={
          <PrivateRoute>
            <EditQuestion />
          </PrivateRoute>
        } />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal />
    </AuthProvider>
  )
}

export default App
