import { Button } from 'antd'
import classes from './../EditCreatePage.module.scss'

export default function TagFields({ fields, register, errors, append, remove }) {
  return (
    <div className={classes.editing__label}>
      Tags
      {fields.map((field, index) => (
        <section key={field.id}>
          <input
            {...register(`tags.${index}.name`, {
              required:
                "Tag is required! If you don't want to provide a Tag, please delete the tag before submitting the form",
            })}
            className={`${classes.editing__tag} ${errors.tags?.[index]?.name && classes['input-error']}`}
            placeholder={`Tag #${index + 1}`}
          />
          {errors.tags?.[index]?.name && <p className={classes['error-message']}>{errors.tags[index].name.message}</p>}
          <Button
            size="large"
            danger
            onClick={() => {
              remove(index)
            }}
          >
            Delete
          </Button>
        </section>
      ))}
      <Button
        size="large"
        onClick={() => {
          append({ name: '' })
        }}
      >
        Add tag
      </Button>
    </div>
  )
}
