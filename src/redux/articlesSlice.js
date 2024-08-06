import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const dislike = createAsyncThunk('articles/dislike', async (slug, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.delete(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    return response.data
  } catch (e) {
    return rejectWithValue(e.message)
  }
})

export const like = createAsyncThunk('articles/like', async (slug, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.post(
      `https://blog.kata.academy/api/articles/${slug}/favorite`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )

    return response.data
  } catch (e) {
    return rejectWithValue(e.message)
  }
})

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (page = 0, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(`https://blog.kata.academy/api/articles?limit=10&offset=${page * 10}`, {
      headers: { Authorization: `Token ${token}` },
    })
    return response.data
  } catch (e) {
    return rejectWithValue(e.message)
  }
})

export const fetchArticlesCount = createAsyncThunk('articles/fetchArticlesCount', async function () {
  const response = await fetch(`https://blog.kata.academy/api/articles?limit=9000`)

  const data = await response.json()

  return data.articlesCount
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    loading: true,
    articles: [],
    error: null,
    count: 0,
  },
  reducers: {
    resetArticles(state) {
      state.articles = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.loading = false
      state.articles = action.payload.articles
    })
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
      console.log(action.error)
    })
    builder.addCase(fetchArticlesCount.fulfilled, (state, action) => {
      state.count = action.payload
    })
  },
})

export const { resetArticles } = articlesSlice.actions

export default articlesSlice.reducer
