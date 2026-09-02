import { useId, useState, type FormEvent } from 'react'
import styled from 'styled-components'

import FormButton from '../../../ui/FormButton'

type Props = {
  onSubmit: (text: string) => Promise<void>
  error: string | null
}

export const CommentForm = ({ error, onSubmit }: Props) => {
  const [text, setText] = useState('')
  // useId даёт идентификатор, одинаковый на сервере и в браузере: обычный
  // счётчик или Math.random() разошлись бы при гидрации.
  const id = useId()
  const fieldId = `${id}-comment`
  const errorId = `${id}-error`

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const value = text.trim()

    if (!value) {
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit(value)
      setText('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor={fieldId}>Ваш ответ</Label>

      <Textarea
        id={fieldId}
        rows={4}
        value={text}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholder="Что скажешь?"
        onChange={event => setText(event.target.value)}
      />
      {error && (
        <Error id={errorId} role="alert">
          {error}
        </Error>
      )}

      <FormButton disabled={!text.trim() || isSubmitting}>Добавить</FormButton>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;

  background: ${({ theme }) => theme.colors.background.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 10px;

  color: ${({ theme }) => theme.colors.text.primary};
  /* Без font: inherit textarea берёт системный моноширинный шрифт. */
  font: inherit;
  font-size: 16px;
  line-height: 1.5;

  /* По горизонтали тянуть нельзя: растянет колонку страницы. */
  resize: vertical;

  transition: border-color 0.3s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.border.strong};
    }
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.border.focus};
    outline: none;
  }
`

const Error = styled.span`
  color: ${({ theme }) => theme.colors.feedback.danger};
  font-size: 13px;
  line-height: 1.4;
`
