import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import classes from './../EditCreatePage.module.scss'
import TagFields from './TagFields'
import { resetArticle } from '../../../redux/createEditSlice'
import { useDispatch } from 'react-redux'

export default function Form({ onSubmit, article, pageStatus, pathname }) {
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors, isValid },
    control,
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      body: '',
      tags: [{ name: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ name: 'tags', control })

  useEffect(() => {
    dispatch(resetArticle())
    reset({
      title: '',
      description: '',
      body: '',
      tags: [{ name: '' }],
    })
  }, [pathname])

  useEffect(() => {
    if (article && pageStatus === 'edit') {
      reset({
        title: article.title || '',
        description: article.description || '',
        body: article.body || '',
        tags: article.tagList ? article.tagList.map((tag) => ({ name: tag })) : [{ name: '' }],
      })
    }
  }, [article, reset])

  const renderInputField = (type, name, placeholder, validation) => (
    <label className={classes.editing__label}>
      {placeholder}
      <input
        type={type}
        {...register(name, validation)}
        className={`${classes.editing__input} ${errors[name] && classes['input-error']}`}
        placeholder={placeholder}
      />
      {errors[name] && <p className={classes['error-message']}>{errors[name]?.message || 'Error'}</p>}
    </label>
  )

  return (
    <form className={classes.editing} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={classes.editing__heading}>
        {pageStatus === 'edit' ? 'Edit ' : 'Create new '}
        article
      </h3>
      <div className={classes.editing__form}>
        {renderInputField('text', 'title', 'Title', {
          required: 'Required',
        })}
        {renderInputField('text', 'description', 'Short description', {
          required: 'Required',
        })}
        <label className={classes.editing__label}>
          Text
          <textarea
            {...register('body', {
              required: 'Required',
              minLength: {
                value: 1,
                message: 'There should be at least one character',
              },
            })}
            className={`${classes.editing__textarea} ${errors['body'] && classes['input-error']}`}
            placeholder="Text"
          />
          {errors['body'] && <p className={classes['error-message']}>{errors['body']?.message || 'Error'}</p>}
        </label>
        <TagFields fields={fields} register={register} errors={errors} append={append} remove={remove} />
      </div>
      <div className={classes.editing__submit}>
        <button disabled={!isValid} type="submit" className={classes.editing__button}>
          Send
        </button>
      </div>
    </form>
  )
}
