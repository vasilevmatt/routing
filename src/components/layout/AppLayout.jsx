import { ConfigProvider } from 'antd'
import AppHeader from './AppHeader'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: {
            defaultBg: 'rgba(0, 0, 0, 0)',
            defaultColor: 'rgba(0, 0, 0, 0.8)',
            colorBorder: 'rgba(0, 0, 0, 0.8)',
          },
          Pagination: {
            itemActiveBg: '#1890FF',
            itemBg: 'rgba(0, 0, 0, 0)',
            colorPrimary: 'white',
          },
        },
      }}
    >
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <footer />
    </ConfigProvider>
  )
}
