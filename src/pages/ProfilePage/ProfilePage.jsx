import { useDispatch } from 'react-redux'
import classes from './ProfilePage.module.scss'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { updateUser } from '../../redux/authSlice'
import { useAuth } from '../../hooks/useAuth'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: 'onBlur' })

  const onSubmit = (data) => {
    const { username, email, password, url: image } = data
    dispatch(updateUser({ user: { username, email, password, image } }))
    navigate('/')
  }

  const renderInputField = (type, name, placeholder, validation, value = null) => (
    <label className={classes.reg__label}>
      {placeholder}
      <input
        type={type}
        defaultValue={value}
        {...register(name, validation)}
        className={`${classes.reg__input} ${errors[name] && classes['input-error']}`}
        placeholder={placeholder}
      />
      {errors[name] && <p className={classes['error-message']}>{errors[name]?.message || 'Error'}</p>}
    </label>
  )

  return (
    <form className={classes.reg} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={classes.reg__heading}>Edit profile</h3>
      <div className={classes.reg__form}>
        {renderInputField(
          'text',
          'username',
          'Username',
          {
            required: 'Required',
            pattern: {
              value: /^[a-z][a-z0-9]*$/,
              message: 'You can only use lowercase English letters and numbers',
            },
          },
          user.username
        )}
        {renderInputField('email', 'email', 'Email address', { required: 'Required' }, user.email)}
        {renderInputField('password', 'password', 'New password', {
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
        {renderInputField('text', 'url', 'Avatar image', {}, user.image)}
      </div>
      <div className={classes.reg__submit}>
        <button disabled={!isValid} type="submit" className={classes.reg__button}>
          Save
        </button>
      </div>
    </form>
  )
}
