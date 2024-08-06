import { Link, useLocation, useNavigate } from 'react-router-dom'
import classes from './SignInPage.module.scss'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { cleanErrors, login } from '../../redux/authSlice'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react'

export default function SignInPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPage = location.state?.from?.pathname || '/'
  const { responseErrors, isLogged } = useAuth()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setError,
    clearErrors,
  } = useForm({ mode: 'onBlur' })

  const onSubmit = (data) => {
    const { email, password } = data
    dispatch(login({ email, password }))
      .then(() => {
        if (isLogged) {
          reset()
          navigate(fromPage)
        }
      })
      .catch(() => {
        if (!responseErrors['email or password']) {
          Object.entries(responseErrors).forEach(([key, message]) => {
            setError(key, { type: 'server', message })
          })
        }
      })
  }

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

  const handleInputChange = (name) => {
    clearErrors(name)
    clearErrors('root.serverError')
  }

  useEffect(() => {
    if (responseErrors['email or password']) {
      setError('root.serverError', {
        type: 'server',
        message: 'Email or password is invalid',
      })
    }
  }, [responseErrors])

  useEffect(() => {
    return () => {
      dispatch(cleanErrors())
    }
  }, [dispatch, cleanErrors])

  return (
    <form className={classes.reg} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={classes.reg__heading}>Sign in</h3>
      <div className={classes.reg__form}>
        {renderInputField('email', 'email', 'Email address', { required: 'Required' })}
        {renderInputField('password', 'password', 'Password', {
          required: 'Required',
          minLength: {
            value: 6,
            message: 'Your password needs to be at least 6 characters.',
          },
        })}
        {errors.root?.serverError && (
          <p className={classes['error-message']}>{errors.root.serverError.message || 'Invalid email or password.'}</p>
        )}
      </div>
      <div className={classes.reg__submit}>
        <button disabled={!isValid} type="submit" className={classes.reg__button}>
          Login
        </button>
        <p className={classes.reg__already}>
          Don't have an account?{' '}
          <Link to="/sign-up" className={classes.reg__link}>
            Sign Up
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
