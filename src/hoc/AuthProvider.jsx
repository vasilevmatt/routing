import { createContext } from 'react'
import { useSelector } from 'react-redux'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  const isLogged = useSelector((state) => state.auth.isAuthenticated)
  const isLoading = useSelector((state) => state.auth.isLoading)
  const isSignUpLoading = useSelector((state) => state.auth.isSignUpLoading)
  const responseErrors = useSelector((state) => state.auth.error)

  return (
    <AuthContext.Provider value={{ user, isLogged, isSignUpLoading, isLoading, responseErrors }}>
      {children}
    </AuthContext.Provider>
  )
}
