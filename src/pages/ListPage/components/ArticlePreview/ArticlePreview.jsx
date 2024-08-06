import { Tag } from 'antd'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import classes from './ArticlePreview.module.scss'
import ArticleLikes from '../../../../components/ArticleLikes/ArticleLikes'

export default function ArticlePreview({
  author,
  updatedAt,
  title,
  description,
  favoritesCount,
  tagList,
  slug,
  favorited,
}) {
  const formattedDate = format(updatedAt, 'PPP')
  const tags = tagList.map((item, index) => {
    if (typeof item !== 'string') return
    if (item.trim()) {
      return <Tag key={index}>{item}</Tag>
    }
  })

  function truncateDescription(description, maxLength) {
    const truncated = description.slice(0, maxLength)
    if (truncated.length !== description.length) {
      const lastSpaceIndex = truncated.lastIndexOf(' ')
      return lastSpaceIndex !== -1 ? truncated.slice(0, lastSpaceIndex) + '...' : truncated
    }
    return description
  }

  return (
    <div className={classes.card}>
      <div className={classes.card__header}>
        <div>
          <div className={classes.card__heading}>
            <Link className={classes.card__link} to={`/articles/${slug}`}>
              <h5 className={classes.card__title}>{title.trim() ? title : 'Unnamed article'}</h5>
            </Link>
            <ArticleLikes slug={slug} initialFavorited={favorited} initialLikesCount={favoritesCount} />
          </div>
          <div className={classes.card__tags}>{tags}</div>
        </div>
        <div className={classes.card__author}>
          <div>
            <p className={classes.card__name}>{author.username}</p>
            <p className={classes.card__date}>{formattedDate}</p>
          </div>
          <img src={author.image} alt="article author image" className={classes.card__avatar} width={46} height={46} />
        </div>
      </div>

      <p className={classes.card__text}>{description ? truncateDescription(description, 200) : 'No description'}</p>
    </div>
  )
}
