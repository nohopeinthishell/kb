import { useId, useState, type FormEvent } from 'react'
import styled from 'styled-components'

import FormButton from '../../../ui/FormButton'

type Props = {
  onSubmit: (text: string) => void
}

export const CommentForm = ({ onSubmit }: Props) => {
  const [text, setText] = useState('')
  // useId даёт идентификатор, одинаковый на сервере и в браузере: обычный
  // счётчик или Math.random() разошлись бы при гидрации.
  const fieldId = `comment-${useId()}`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = text.trim()

    if (!value) {
      return
    }

    onSubmit(value)
    setText('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor={fieldId}>Ваш ответ</Label>

      <Textarea
        id={fieldId}
        rows={4}
        value={text}
        placeholder="Что скажешь?"
        onChange={event => setText(event.target.value)}
      />

      <FormButton disabled={!text.trim()}>Добавить</FormButton>
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
