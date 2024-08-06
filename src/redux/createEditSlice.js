import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const editArticle = createAsyncThunk('createEdit/editArticle', async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')

    const articleData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tagList,
      },
    }

    const response = await axios.put(`https://blog.kata.academy/api/articles/${data.slug}`, articleData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return response.data
  } catch (error) {
    return rejectWithValue({ status: error.response.status })
  }
})

export const createArticle = createAsyncThunk('createEdit/createArticle', async (data, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')

    const articleData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tagList,
      },
    }

    const response = await axios.post(`https://blog.kata.academy/api/articles`, articleData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return response.data
  } catch (error) {
    return rejectWithValue({ status: error.response.status, message: error.response.data })
  }
})

const createEditSlice = createSlice({
  name: 'createEdit',
  initialState: {
    article: {},
    error: null,
    editStatus: null,
  },
  reducers: {
    resetEditStatus: (state) => {
      state.editStatus = null
    },
    resetArticle: (state) => {
      state.article = {}
      state.error = null
      state.editStatus = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editArticle.pending, (state, action) => {
        state.editStatus = 'loading'
        state.article = action.payload
      })
      .addCase(editArticle.fulfilled, (state, action) => {
        state.editStatus = 'succeeded'
        state.article = action.payload
      })
      .addCase(editArticle.rejected, (state, action) => {
        state.editStatus = 'failed'
        state.error = action.payload
      })
      .addCase(createArticle.pending, (state, action) => {
        state.editStatus = 'loading'
        state.article = action.payload
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.editStatus = 'succeeded'
        state.article = action.payload
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.editStatus = 'failed'
        state.error = action.payload
      })
  },
})

export const { resetEditStatus, resetArticle } = createEditSlice.actions

export default createEditSlice.reducer
