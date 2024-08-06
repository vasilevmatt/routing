import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Card, Flex, Skeleton } from 'antd'

export default function RequireAuth({ children }) {
  const location = useLocation()
  const { isLogged, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Flex align="center">
        <Card style={{ width: '40%' }}>
          <Skeleton active />
        </Card>
      </Flex>
    )
  }

  if (!isLogged) {
    return <Navigate to="/sign-in" state={{ from: location }} />
  }

  return children
}
