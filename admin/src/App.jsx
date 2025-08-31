import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/Login.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import EditorPage from './pages/Editor.jsx'

function PrivateRoute({ children }) {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
          <Route path="/new" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
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
