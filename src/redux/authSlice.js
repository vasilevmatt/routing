import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://blog.kata.academy/api/users', { user: userData })
    const { token } = response.data.user
    localStorage.setItem('token', token)
    return response.data.user
  } catch (error) {
    return rejectWithValue(error.response.data.errors)
  }
})

export const updateUser = createAsyncThunk('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.put('https://blog.kata.academy/api/user', userData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    return response.data.user
  } catch (e) {
    return rejectWithValue(e.response.data.errors)
  }
})

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://blog.kata.academy/api/users/login', { user: userData })
    const { token } = response.data.user
    localStorage.setItem('token', token)
    return response.data.user
  } catch (e) {
    return rejectWithValue(e.response.data.errors)
  }
})

export const verifyUser = createAsyncThunk('auth/verifyUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token not found')

    const response = await axios.get('https://blog.kata.academy/api/user', {
      headers: { Authorization: `Token ${token}` },
    })

    return response.data.user
  } catch (e) {
    localStorage.removeItem('token')
    return rejectWithValue(e.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: {},
    isSignUpLoading: true,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    cleanErrors: (state) => {
      state.error = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        console.log('reje', action.payload)
        state.error = action.payload
      })
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isLoading = false
      })
      .addCase(verifyUser.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(registerUser.pending, (state) => {
        state.isSignUpLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isSignUpLoading = false
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isSignUpLoading = false
        state.error = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload
        console.log(action.payload)
      })
  },
})

export const { logout, cleanErrors } = authSlice.actions
export default authSlice.reducer
