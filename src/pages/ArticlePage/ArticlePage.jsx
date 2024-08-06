import { Button, Flex, message, Popconfirm, Skeleton, Tag } from 'antd'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteArticle, fetchArticleBySlug, resetError } from '../../redux/currentArticleSlice'
import classes from './ArticlePage.module.scss'
import Markdown from 'markdown-to-jsx'
import { useAuth } from '../../hooks/useAuth'
import ArticleLikes from '../../components/ArticleLikes/ArticleLikes'

export default function ArticlePage() {
  const [messageApi, contextHolder] = message.useMessage()

  const dispatch = useDispatch()
  const { slug } = useParams()
  const navigate = useNavigate()

  const { isLogged } = useAuth()

  const article = useSelector((state) => state.currentArticle.article)
  const loadingStatus = useSelector((state) => state.currentArticle.loading)
  const error = useSelector((state) => state.currentArticle.error)
  const deleteStatus = useSelector((state) => state.currentArticle.deleteStatus)

  useEffect(() => {
    if (error) {
      const reason = error.status === 403 ? "You can't delete that article." : 'Please, try again later'
      messageApi.open({
        type: 'error',
        content: reason,
      })
    }
  }, [error, messageApi])

  const onDelete = () => {
    dispatch(deleteArticle(slug))
  }

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug))
  }, [dispatch, slug])

  useEffect(() => {
    if (deleteStatus === 'succeed') {
      navigate('/')
    }
  }, [deleteStatus, navigate])

  useEffect(() => {
    return () => {
      dispatch(resetError())
    }
  }, [dispatch])

  return (
    <div className={classes.article}>
      {contextHolder}
      {renderContent(article, loadingStatus, isLogged, onDelete)}
    </div>
  )
}

function renderContent(article, loadingStatus, isLogged, onDelete) {
  if (loadingStatus) {
    return <Skeleton active />
  }

  const { author, updatedAt, title, body, favoritesCount, tagList, description, slug, favorited } = article
  const formattedDate = format(updatedAt, 'PPP')
  const tags = tagList.map((item, index) => {
    if (typeof item !== 'string') return null
    if (item.trim()) {
      return <Tag key={index}>{item}</Tag>
    }
    return null
  })
  return (
    <>
      <div className={classes.article__header}>
        <div>
          <div className={classes.article__heading}>
            <h5 className={classes.article__title}>{title.trim() ? title : 'Unnamed article'}</h5>
            <ArticleLikes slug={slug} initialLikesCount={favoritesCount} initialFavorited={favorited} />
          </div>
          {tags}
        </div>
        <div className={classes.article__author}>
          <div>
            <p className={classes.article__name}>{author.username}</p>
            <p className={classes.article__date}>{formattedDate}</p>
          </div>
          <img src={author.image} alt="article author" className={classes.article__avatar} width={46} height={46} />
        </div>
      </div>
      <Flex align="center" justify="space-between">
        {description && <p className={classes.article__description}>{description}</p>}
        {isLogged && (
          <Flex gap={12}>
            <Popconfirm placement="rightTop" description="Are you sure to delete that article?" onConfirm={onDelete}>
              <Button danger>Delete</Button>
            </Popconfirm>
            <Link to={`/articles/${slug}/edit`}>
              <Button>Edit</Button>
            </Link>
          </Flex>
        )}
      </Flex>
      <p className={classes.article__text}>{body ? <Markdown>{body}</Markdown> : 'No text'}</p>
    </>
  )
}
