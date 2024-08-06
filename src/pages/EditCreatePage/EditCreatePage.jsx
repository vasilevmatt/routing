import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, Flex, Skeleton, message } from 'antd'
import { useEffect } from 'react'
import { fetchArticleBySlug } from '../../redux/currentArticleSlice'
import { createArticle, editArticle, resetArticle, resetEditStatus } from '../../redux/createEditSlice'
import Form from './components/Form'

export default function EditCreatePage() {
  const { slug } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [messageApi, contextHolder] = message.useMessage()

  const pageStatus = location.pathname.endsWith('/edit') ? 'edit' : 'new'

  const article = useSelector((state) => state.currentArticle.article)
  const loadingStatus = useSelector((state) => state.currentArticle.loading)
  const error = useSelector((state) => state.createEdit.error)
  const editStatus = useSelector((state) => state.createEdit.editStatus)
  const newArticle = useSelector((state) => state.createEdit.article)

  useEffect(() => {
    if (error) {
      const reason = error.status === 403 ? "You don't have enough rights to do that." : 'Please, try again later'
      messageApi.open({
        type: 'error',
        content: reason,
      })
    }
  }, [error, messageApi])

  useEffect(() => {
    return () => {
      dispatch(resetArticle())
    }
  }, [dispatch])

  useEffect(() => {
    if (pageStatus === 'edit' && article.slug !== slug) {
      dispatch(fetchArticleBySlug(slug))
    }
    return () => {
      dispatch(resetEditStatus())
    }
  }, [dispatch, slug, pageStatus, article.slug])

  useEffect(() => {
    if (editStatus === 'succeeded') {
      if (pageStatus === 'edit') {
        navigate(`/articles/${slug}`)
      } else if (pageStatus === 'new') {
        console.log(newArticle)
        navigate(`/articles/${newArticle.article.slug}`)
      }
      dispatch(resetEditStatus())
    }
  }, [editStatus, pageStatus, slug, navigate, dispatch])

  if (loadingStatus && pageStatus === 'edit') {
    return (
      <Flex align="center">
        <Card style={{ width: '40%', margin: 'auto' }}>
          <Skeleton active />
        </Card>
      </Flex>
    )
  }

  const handleSubmit = (data) => {
    const { title, body, description, tags } = data
    const tagList = tags.map((tag) => tag.name)

    if (pageStatus === 'edit') {
      dispatch(editArticle({ slug, title, body, description, tagList }))
    } else {
      dispatch(createArticle({ title, body, description, tagList }))
    }
  }

  return (
    <>
      {contextHolder}
      <Form onSubmit={handleSubmit} article={article} pageStatus={pageStatus} pathname={location.pathname} />
    </>
  )
}
