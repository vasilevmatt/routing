import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchArticleBySlug = createAsyncThunk(
  'currentArticle/fetchArticleBySlug',
  async function (slug, { rejectWithValue }) {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      return response.data.article
    } catch (error) {
      return rejectWithValue({ status: error.response.status })
    }
  }
)

export const deleteArticle = createAsyncThunk('currentArticle/delete', async (slug, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`https://blog.kata.academy/api/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    return response.data
  } catch (error) {
    return rejectWithValue({ status: error.response.status })
  }
})

const currentArticleSlice = createSlice({
  name: 'currentArticle',
  initialState: {
    loading: true,
    article: {},
    error: null,
    deleteStatus: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null
      state.deleteStatus = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.error = null
        state.loading = true
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.loading = false
        state.article = action.payload
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteArticle.fulfilled, (state) => {
        state.error = null
        state.deleteStatus = 'succeed'
      })
      .addCase(deleteArticle.pending, (state) => {
        state.error = null
        state.deleteStatus = 'pending'
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.error = action.payload
        state.deleteStatus = 'rejected'
      })
  },
})

export const { resetError } = currentArticleSlice.actions

export default currentArticleSlice.reducer
