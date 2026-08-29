import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'

import { ApiError, updateAvatar } from '../../../api'
import type { User } from '../../../api'
import FormButton from '../../../ui/FormButton'
import { ModalActions, ProfileModal } from './ProfileModal'
import { SecondaryButton } from './ProfileButtons'

type AvatarEditorProps = {
  initials: string
  onClose: () => void
  onUpdated: (user: User) => void
}

export const AvatarEditor = ({
  initials,
  onClose,
  onUpdated,
}: AvatarEditorProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview)
    },
    [preview]
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (preview) URL.revokeObjectURL(preview)
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setError(null)
  }

  const handleSubmit = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)
    try {
      onUpdated(await updateAvatar(file))
      onClose()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProfileModal
      title="Смена аватара"
      description="Загрузите изображение в формате JPG, PNG или WebP."
      onClose={onClose}>
      <Upload>
        <Avatar>
          {preview ? (
            <AvatarImage src={preview} alt="Новый аватар" />
          ) : (
            initials
          )}
        </Avatar>
        <FileLabel>
          Выбрать файл
          <HiddenInput
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
          />
        </FileLabel>
      </Upload>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      <ModalActions>
        <SecondaryButton type="button" onClick={onClose}>
          Отмена
        </SecondaryButton>
        <SubmitButton
          type="button"
          disabled={!file || isLoading}
          onClick={handleSubmit}>
          {isLoading ? 'Загрузка…' : 'Сохранить'}
        </SubmitButton>
      </ModalActions>
    </ProfileModal>
  )
}

export const ProfileAvatar = styled.div`
  width: 112px;
  height: 112px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.action.primary};
  color: ${({ theme }) => theme.colors.action.primaryText};
  font-size: 34px;
  font-weight: 700;
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Avatar = styled(ProfileAvatar)``
const Upload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`
const FileLabel = styled.label`
  min-height: 44px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.action.secondary};
  color: ${({ theme }) => theme.colors.action.secondaryText};
  font-weight: 600;
  cursor: pointer;
`
const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`
const ErrorMessage = styled.p`
  margin: 20px 0 0;
  color: ${({ theme }) => theme.colors.feedback.danger};
`
const SubmitButton = styled(FormButton)`
  min-height: 44px;
`

const getErrorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : 'Не удалось связаться с сервером'
