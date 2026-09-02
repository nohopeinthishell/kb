import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'
import { ROUTES, topicPath } from '../../constants/routes'
import FormField from '../../ui/FormField'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createTopic } from '../../modules/forum'
import FormButton from '../../ui/FormButton'

export const NewTopicPage = () => {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setError(null)
    event.preventDefault()
    setIsSubmitting(true)

    const value = title.trim()

    if (!value) {
      setIsSubmitting(false)
      return
    }

    try {
      const topic = await createTopic(value)
      navigate(topicPath(topic.id))
    } catch {
      setError('Не удалось создать тему')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page>
      <Helmet>
        <title>Форум — новая тема</title>
      </Helmet>

      <Title>Форум — новая тема</Title>
      <BackLink to={ROUTES.forum.root}>
        <span aria-hidden="true">←</span> К списку тем
      </BackLink>
      <Form onSubmit={handleSubmit}>
        <FormField
          label="Название темы"
          value={title}
          maxLength={120}
          error={error ?? undefined}
          onChange={event => setTitle(event.target.value)}
        />
        <FormButton disabled={!title.trim() || isSubmitting}>
          Создать
        </FormButton>
      </Form>
    </Page>
  )
}

const Page = styled.main`
  width: min(100%, 720px);
  margin: 0 auto;
  padding: clamp(24px, 5vw, 64px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Title = styled.h1`
  margin: 0;
  font-size: 48px;
  text-align: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const BackLink = styled(Link)`
  align-self: start;

  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.text.link};
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
    border-radius: 4px;
  }
`

export const initNewTopicPage = async () => Promise.resolve()
