import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { dislike, like } from '../../redux/articlesSlice'
import { useAuth } from '../../hooks/useAuth'
import classes from './ArticleLikes.module.scss'

export default function ArticleLikes({ slug, initialFavorited, initialLikesCount }) {
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const { isLogged } = useAuth()
  const dispatch = useDispatch()

  const handleFavorite = (slug, isLike) => {
    if (isLogged) {
      if (isLike) {
        dispatch(like(slug))
        setLikesCount((prev) => prev + 1)
        setIsFavorited(true)
      } else {
        dispatch(dislike(slug))
        setLikesCount((prev) => prev - 1)
        setIsFavorited(false)
      }
    }
  }

  return (
    <div className={classes.likes}>
      {isFavorited ? (
        <HeartFilled
          className={`${classes['card__heart--liked']} ${classes.card__heart}`}
          onClick={() => handleFavorite(slug, false)}
        />
      ) : (
        <HeartOutlined className={classes.card__heart} onClick={() => handleFavorite(slug, true)} />
      )}
      <span className={classes.card__likes}>{likesCount}</span>
    </div>
  )
}
