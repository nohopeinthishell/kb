import { MouseEvent, ReactNode } from 'react'
import styled from 'styled-components'

type ProfileModalProps = {
  title: string
  description: string
  children: ReactNode
  onClose: () => void
}

export const ProfileModal = ({
  title,
  description,
  children,
  onClose,
}: ProfileModalProps) => {
  const stopPropagation = (event: MouseEvent) => event.stopPropagation()

  return (
    <Backdrop role="presentation" onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onMouseDown={stopPropagation}>
        <Header>
          <Title id="profile-modal-title">{title}</Title>
          <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
            ×
          </CloseButton>
        </Header>
        <Description>{description}</Description>
        {children}
      </Dialog>
    </Backdrop>
  )
}

export const ModalActions = styled.div`
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
  padding: 20px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.background.overlay};
`

const Dialog = styled.div`
  width: 480px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.surface};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 28px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.action.secondaryHover};
  }
`

const Description = styled.p`
  margin: 10px 0 24px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`
