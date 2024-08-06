import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.scss'
import articlesReducer from './redux/articlesSlice'
import currentArticleSlice from './redux/currentArticleSlice'
import authSlice from './redux/authSlice'
import createEditSlice from './redux/createEditSlice'

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    currentArticle: currentArticleSlice,
    auth: authSlice,
    createEdit: createEditSlice,
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
