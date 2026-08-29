import styled from 'styled-components'

const FormButton = styled.button`
  min-height: 52px;
  padding: 0 24px;

  background: ${({ theme }) => theme.colors.action.primary};
  border: 0;
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.action.primaryText};
  font: inherit;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.action.primaryHover};
      transform: translateY(-1px);
    }
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.action.primaryActive};
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.action.disabledText};
    background: ${({ theme }) => theme.colors.action.disabled};
    cursor: not-allowed;
  }
`

export default FormButton
