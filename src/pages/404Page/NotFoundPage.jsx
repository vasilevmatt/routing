import { Button, Card, Result } from 'antd'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Card
      style={{
        width: '80%',
        margin: 'auto',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link to="/">Back Home</Link>
          </Button>
        }
      />
    </Card>
  )
}
