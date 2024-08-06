import { Alert, Card, Pagination, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArticles, fetchArticlesCount, resetArticles } from '../../redux/articlesSlice'
import classes from './ListPage.module.scss'
import ArticlePreview from './components/ArticlePreview/ArticlePreview'

export default function ListPage() {
  const dispatch = useDispatch()
  const articles = useSelector((state) => state.articles.articles)
  const loadingStatus = useSelector((state) => state.articles.loading)
  const articlesCount = useSelector((state) => state.articles.count)
  const error = useSelector((state) => state.articles.error)

  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(fetchArticlesCount())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchArticles(page))
  }, [page, dispatch])

  useEffect(() => {
    if (loadingStatus) {
      setLoading(true)
    } else {
      const timer = setTimeout(() => setLoading(false), 550)
      return () => clearTimeout(timer)
    }
  }, [loadingStatus])

  useEffect(() => {
    return () => dispatch(resetArticles())
  }, [dispatch])

  const handlePageChange = (newPage) => setPage(newPage - 1)

  return (
    <>
      <div className={classes.list}>
        {error ? (
          <Alert message="Error" description={`Karma is my error: ${error}`} type="error" showIcon />
        ) : (
          renderCards(articles, loading)
        )}
      </div>
      <Pagination
        className={classes.list__pagination}
        current={page + 1}
        total={articlesCount}
        onChange={handlePageChange}
        align="center"
      />
    </>
  )
}

function renderCards(articles, loading) {
  if (loading) {
    return Array.from({ length: 10 }, (_, index) => (
      <Card className={classes.list__loading} key={index}>
        <Skeleton loading={loading} active avatar size="small" paragraph={{ rows: 1 }} block={false} />
      </Card>
    ))
  }

  return articles.map((item, index) => <ArticlePreview {...item} key={index} />)
}
