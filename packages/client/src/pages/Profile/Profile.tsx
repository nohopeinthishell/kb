import type { User } from '../../api'
import type { PageInitArgs } from '../../routes'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { ApiError, logout, updateProfile } from '../../api'
import { ROUTES } from '../../constants/routes'
import { usePage } from '../../hooks/usePage'

import {
  AvatarEditor,
  AvatarImage,
  DangerButton,
  PasswordModal,
  ProfileAvatar,
  SecondaryButton,
} from '../../modules/profile'

import { initAuth } from '../../modules/auth'

import {
  clearUser,
  selectUser,
  setUser as setStoredUser,
} from '../../slices/userSlice'

import { useDispatch, useSelector } from '../../store'

import FormButton from '../../ui/FormButton'
import FormField from '../../ui/FormField'

type EditableUserField = keyof Pick<
  User,
  'first_name' | 'second_name' | 'display_name' | 'phone' | 'login' | 'email'
>

type ModalName = 'avatar' | 'password' | null

const emptyUser: User = {
  id: 0,
  first_name: '',
  second_name: '',
  display_name: '',
  phone: '',
  login: '',
  avatar: null,
  email: '',
}

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage, revalidateOnClient: true })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const storedUser = useSelector(selectUser)

  const [user, setUser] = useState<User>(storedUser ?? emptyUser)
  const [activeModal, setActiveModal] = useState<ModalName>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!storedUser) return

    setUser(current =>
      current.id === 0
        ? storedUser
        : {
            ...current,
            avatar: storedUser.avatar,
          }
    )
  }, [storedUser])

  useEffect(() => {
    if (!activeModal) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveModal(null)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeModal])

  function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as EditableUserField

    setUser(current => ({ ...current, [field]: event.target.value }))
    setIsSaved(false)
    setRequestError(null)
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSaving(true)
    setIsSaved(false)
    setRequestError(null)

    try {
      const updated = await updateProfile({
        first_name: user.first_name,
        second_name: user.second_name,
        display_name: user.display_name,
        login: user.login,
        email: user.email,
        phone: user.phone,
      })

      dispatch(setStoredUser(updated))
      setIsSaved(true)
    } catch (error) {
      setRequestError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true)
    setRequestError(null)

    try {
      await logout()
      dispatch(clearUser())
      navigate(ROUTES.signIn)
    } catch (error) {
      setRequestError(getErrorMessage(error))
      setIsLoggingOut(false)
    }
  }

  function handleAvatarUpdated(updated: User) {
    dispatch(setStoredUser(updated))
    setUser(current => ({
      ...current,
      avatar: updated.avatar,
    }))
  }

  const initials = `${user.first_name.charAt(0)}${user.second_name.charAt(0)}`

  const avatarUrl = user.avatar
    ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}`
    : null

  return (
    <Page>
      <Helmet>
        <title>Профиль | Таверна</title>
      </Helmet>
      <PageHeader>
        <BackButton type="button" onClick={() => navigate(ROUTES.main)}>
          <Arrow aria-hidden="true">←</Arrow>На главную
        </BackButton>
        <HeadingGroup>
          <Title>Профиль</Title>
          <Description>Управляйте личными данными и безопасностью</Description>
        </HeadingGroup>
      </PageHeader>
      <Content>
        <Sidebar>
          <ProfileAvatar>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Аватар пользователя" />
            ) : (
              initials
            )}
          </ProfileAvatar>
          <UserName>
            {user.display_name || `${user.first_name} ${user.second_name}`}
          </UserName>
          <UserLogin>@{user.login}</UserLogin>
          <SecondaryButton
            type="button"
            onClick={() => setActiveModal('avatar')}>
            Сменить аватар
          </SecondaryButton>
          <Divider />
          <DangerButton
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}>
            {isLoggingOut ? 'Выходим…' : 'Выйти из аккаунта'}
          </DangerButton>
        </Sidebar>
        <MainColumn>
          <Card>
            <SectionHeader>
              <div>
                <SectionTitle>Личные данные</SectionTitle>
                <SectionDescription>
                  Эта информация отображается в вашем профиле
                </SectionDescription>
              </div>
            </SectionHeader>
            <ProfileForm onSubmit={handleProfileSubmit}>
              <FieldsGrid>
                <FormField
                  label="Имя"
                  name="first_name"
                  value={user.first_name}
                  onChange={handleFieldChange}
                  autoComplete="given-name"
                  required
                />
                <FormField
                  label="Фамилия"
                  name="second_name"
                  value={user.second_name}
                  onChange={handleFieldChange}
                  autoComplete="family-name"
                  required
                />
                <WideField>
                  <FormField
                    label="Отображаемое имя"
                    name="display_name"
                    value={user.display_name ?? ''}
                    onChange={handleFieldChange}
                    autoComplete="nickname"
                  />
                </WideField>
                <FormField
                  label="Логин"
                  name="login"
                  value={user.login}
                  onChange={handleFieldChange}
                  autoComplete="username"
                  required
                />
                <FormField
                  label="Почта"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleFieldChange}
                  autoComplete="email"
                  required
                />
                <WideField>
                  <FormField
                    label="Телефон"
                    name="phone"
                    type="tel"
                    value={user.phone}
                    onChange={handleFieldChange}
                    autoComplete="tel"
                    required
                  />
                </WideField>
              </FieldsGrid>
              {requestError && <ErrorMessage>{requestError}</ErrorMessage>}
              <FormFooter>
                <SavedMessage>
                  {isSaved ? 'Изменения сохранены' : ''}
                </SavedMessage>
                <SaveButton type="submit" disabled={isSaving}>
                  {isSaving ? 'Сохранение…' : 'Сохранить изменения'}
                </SaveButton>
              </FormFooter>
            </ProfileForm>
          </Card>
          <SecurityCard>
            <div>
              <SectionTitle>Безопасность</SectionTitle>
              <SectionDescription>
                Обновляйте пароль, чтобы защитить аккаунт
              </SectionDescription>
            </div>
            <SecondaryButton
              type="button"
              onClick={() => setActiveModal('password')}>
              Сменить пароль
            </SecondaryButton>
          </SecurityCard>
        </MainColumn>
      </Content>
      {activeModal === 'avatar' && (
        <AvatarEditor
          initials={initials}
          onClose={() => setActiveModal(null)}
          onUpdated={handleAvatarUpdated}
        />
      )}
      {activeModal === 'password' && (
        <PasswordModal onClose={() => setActiveModal(null)} />
      )}
    </Page>
  )
}

export const initProfilePage = async ({ dispatch, state, ctx }: PageInitArgs) =>
  initAuth({ dispatch, state, ctx })

const getErrorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : 'Не удалось связаться с сервером'

const Page = styled.main`
  min-height: 100%;
  padding: 48px;
  background: ${({ theme }) => theme.colors.background.page};
`
const PageHeader = styled.header`
  width: 1080px;
  margin: 0 auto 32px;
`
const BackButton = styled.button`
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font: inherit;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
  }
`
const Arrow = styled.span`
  font-size: 22px;
`
const HeadingGroup = styled.div`
  margin-top: 28px;
`
const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 44px;
`
const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 17px;
`
const Content = styled.div`
  width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 776px;
  gap: 24px;
  align-items: start;
`
const Card = styled.section`
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.surface};
`
const Sidebar = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
const UserName = styled.h2`
  margin: 18px 0 4px;
  font-size: 22px;
`
const UserLogin = styled.p`
  margin: 0 0 22px;
  color: ${({ theme }) => theme.colors.text.secondary};
`
const Divider = styled.hr`
  width: 100%;
  margin: 24px 0;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
`
const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
`
const SectionTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 22px;
`
const SectionDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`
const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 28px;
`
const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
`
const WideField = styled.div`
  grid-column: 1 / -1;
`
const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
`
const SavedMessage = styled.span`
  margin-right: auto;
  color: ${({ theme }) => theme.colors.feedback.success};
  font-size: 14px;
`
const ErrorMessage = styled.p`
  margin: -8px 0 0;
  color: ${({ theme }) => theme.colors.feedback.danger};
`
const SaveButton = styled(FormButton)`
  min-height: 44px;
`
const SecurityCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`
