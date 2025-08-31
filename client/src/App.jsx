import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/Login.jsx'
import RegisterPage from './pages/Register.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import EditorPage from './pages/Editor.jsx'
import SearchPage from './pages/Search.jsx'
import QAPage from './pages/QA.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/docs/new" element={<PrivateRoute><EditorPage mode="create" /></PrivateRoute>} />
          <Route path="/docs/:id" element={<PrivateRoute><EditorPage mode="edit" /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/qa" element={<PrivateRoute><QAPage /></PrivateRoute>} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
