import React from 'react'
import { Button, ConfigProvider } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/authSlice'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { fetchArticles, resetArticles } from '../../redux/articlesSlice'

const AppHeader = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()

  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  const handleLogout = () => {
    dispatch(logout())
    if (location.pathname === '/') {
      dispatch(resetArticles())
      dispatch(fetchArticles())
    } else {
      navigate('/')
    }
  }

  const HeaderHeading = () => (
    <div className="app-header__navigation">
      <ArrowLeftOutlined onClick={goBack} className="app-header__go-back" />
      <Link to="/" className="app-header__heading">
        <span>RealWorld Blog</span>
      </Link>
    </div>
  )

  const GuestButtons = () => (
    <div className="app-header__buttons-container">
      <Link to="/sign-in">
        <Button type="text" size="large">
          Sign in
        </Button>
      </Link>
      <Link to="/sign-up">
        <Button size="large">Sign Up</Button>
      </Link>
    </div>
  )

  const UserButtons = () => (
    <div className="app-header__buttons-container">
      <ConfigProvider theme={{ components: { Button: { defaultColor: '#52C41A', defaultBorderColor: '#52C41A' } } }}>
        <Button size="small">
          <Link to="/new-article">Create article</Link>
        </Button>
      </ConfigProvider>
      <div className="app-header__user">
        <Link className="app-header__username" to="/profile">
          <span>{user.username}</span>
        </Link>
        <img
          className="app-header__avatar"
          src={user.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
          alt="User Avatar"
          width={46}
          height={46}
        />
      </div>
      <Button size="large" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  )

  return (
    <header className="app-header">
      <HeaderHeading />
      {isAuthenticated ? <UserButtons /> : <GuestButtons />}
    </header>
  )
}

export default AppHeader
