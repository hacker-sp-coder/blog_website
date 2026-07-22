import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import CreateBlog from './pages/CreateBlog'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="post/:id" element={<PostDetail />} />
                <Route path="create" element={<CreateBlog />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
