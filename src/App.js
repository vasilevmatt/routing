import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ListPage from './pages/ListPage/ListPage'
import NotFoundPage from './pages/404Page/NotFoundPage'
import SignInPage from './pages/SignInPage/SignInPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import ArticlePage from './pages/ArticlePage/ArticlePage'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { verifyUser } from './redux/authSlice'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import RequireAuth from './hoc/RequireAuth'
import { AuthProvider } from './hoc/AuthProvider'
import EditCreatePage from './pages/EditCreatePage/EditCreatePage'
import RequireGuest from './hoc/RequireGuest'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(verifyUser())
  }, [dispatch])

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ListPage />} />
          <Route path="articles" element={<ListPage />} />
          <Route path="articles/:slug" element={<ArticlePage />} />
          <Route
            path="articles/:slug/edit"
            element={
              <RequireAuth>
                <EditCreatePage />
              </RequireAuth>
            }
          />
          <Route
            path="new-article"
            element={
              <RequireAuth>
                <EditCreatePage />
              </RequireAuth>
            }
          />
          <Route
            path="sign-in"
            element={
              <RequireGuest>
                <SignInPage />
              </RequireGuest>
            }
          />
          <Route
            path="sign-up"
            element={
              <RequireGuest>
                <SignUpPage />
              </RequireGuest>
            }
          />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
