import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import classes from './SignUpPage.module.scss'
import { registerUser } from '../../redux/authSlice'
import { useAuth } from '../../hooks/useAuth'

export default function SignUpPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { responseErrors, isSignUpLoading } = useAuth()

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setError,
    clearErrors,
  } = useForm({ mode: 'onBlur' })

  const onSubmit = (data) => {
    const { username, email, password } = data
    dispatch(registerUser({ username, email, password }))
      .then(() => {
        if (!isSignUpLoading && Object.keys(responseErrors).length === 0) {
          reset()
          navigate('/')
        }
      })
      .catch(() => {
        Object.entries(responseErrors).forEach(([key, message]) => {
          setError(key, { type: 'server', message })
        })
      })
  }

  const handleInputChange = (name) => {
    clearErrors(name)
  }
  useEffect(() => {
    Object.entries(responseErrors).forEach(([key, message]) => {
      setError(key, { type: 'server', message })
    })
  }, [responseErrors, setError])

  const renderInputField = (type, name, placeholder, validation) => (
    <label className={classes.reg__label}>
      {placeholder}
      <input
        type={type}
        {...register(name, validation)}
        className={`${classes.reg__input} ${errors[name] && classes['input-error']}`}
        placeholder={placeholder}
        onChange={() => handleInputChange(name)}
      />
      {errors[name] && <p className={classes['error-message']}>{errors[name]?.message || 'Error'}</p>}
    </label>
  )

  return (
    <form className={classes.reg} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={classes.reg__heading}>Create new account</h3>
      <div className={classes.reg__form}>
        {renderInputField('text', 'username', 'Username', {
          required: 'Required',
          pattern: {
            value: /^[a-z][a-z0-9]*$/,
            message: 'You can only use lowercase English letters and numbers',
          },
        })}
        {renderInputField('email', 'email', 'Email address', { required: 'Required' })}
        {renderInputField('password', 'password', 'Password', {
          required: 'Required',
          minLength: {
            value: 6,
            message: 'Your password needs to be at least 6 characters.',
          },
          maxLength: {
            value: 40,
            message: 'Your password needs to be no more than 40 characters.',
          },
        })}
        {renderInputField('password', 'repeat', 'Repeat Password', {
          required: 'Required',
          minLength: {
            value: 6,
            message: 'Your password needs to be at least 6 characters.',
          },
          maxLength: {
            value: 40,
            message: 'Your password needs to be no more than 40 characters.',
          },
          validate: (val) => {
            if (watch('password') !== val) {
              return 'Your passwords do not match'
            }
          },
        })}
      </div>
      <div className={classes.reg__agreement}>
        <input defaultChecked type="checkbox" {...register('check', { required: 'Required' })} /> I agree to the
        processing of my personal information
        {errors.check && <p className={classes['error-message']}>{errors.check?.message || 'Error'}</p>}
      </div>
      <div className={classes.reg__submit}>
        <button disabled={!isValid} type="submit" className={classes.reg__button}>
          Create
        </button>
        <p className={classes.reg__already}>
          Already have an account?{' '}
          <Link to="/sign-in" className={classes.reg__link}>
            Sign In
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
