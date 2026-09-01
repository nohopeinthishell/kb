import { FormEvent, useState } from 'react'
import styled from 'styled-components'

import { ApiError, changePassword } from '../../../api'
import FormButton from '../../../ui/FormButton'
import FormField from '../../../ui/FormField'
import { SecondaryButton } from './ProfileButtons'
import { ModalActions, ProfileModal } from './ProfileModal'

type PasswordModalProps = { onClose: () => void }

export const PasswordModal = ({ onClose }: PasswordModalProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const oldPassword = String(data.get('oldPassword') ?? '')
    const newPassword = String(data.get('newPassword') ?? '')
    const repeatedPassword = String(data.get('newPasswordRepeat') ?? '')

    if (newPassword !== repeatedPassword) {
      setError('Новые пароли не совпадают')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await changePassword({ oldPassword, newPassword })
      onClose()
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Не удалось связаться с сервером'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProfileModal
      title="Смена пароля"
      description="Введите текущий пароль и придумайте новый."
      onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        <Fields>
          <FormField
            label="Текущий пароль"
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            required
          />
          <FormField
            label="Новый пароль"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
          />
          <FormField
            label="Повторите новый пароль"
            name="newPasswordRepeat"
            type="password"
            autoComplete="new-password"
            required
          />
        </Fields>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        <ModalActions>
          <SecondaryButton type="button" onClick={onClose}>
            Отмена
          </SecondaryButton>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение…' : 'Сменить пароль'}
          </SubmitButton>
        </ModalActions>
      </Form>
    </ProfileModal>
  )
}

const Form = styled.form``
const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`
const ErrorMessage = styled.p`
  margin: 20px 0 0;
  color: ${({ theme }) => theme.colors.feedback.danger};
`
const SubmitButton = styled(FormButton)`
  min-height: 44px;
`
