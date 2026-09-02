import styled from 'styled-components'

const BaseButton = styled.button`
  min-height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.action.disabledText};
    background: ${({ theme }) => theme.colors.action.disabled};
    cursor: not-allowed;
  }
`

export const SecondaryButton = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.action.secondary};
  color: ${({ theme }) => theme.colors.action.secondaryText};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.action.secondaryHover};
  }
`

export const DangerButton = styled(BaseButton)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.feedback.danger};
  background: ${({ theme }) => theme.colors.feedback.dangerMuted};
  color: ${({ theme }) => theme.colors.feedback.danger};
`
