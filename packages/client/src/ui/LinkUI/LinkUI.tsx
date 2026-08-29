import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

type Variant = 'primary' | 'secondary'

const secondaryStyles = css`
  color: ${({ theme }) => theme.colors.action.secondaryText};
  background: ${({ theme }) => theme.colors.action.secondary};
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.action.secondaryHover};
    }
  }
  &:active {
    background: ${({ theme }) => theme.colors.action.secondaryActive};
  }
`

const LinkUI = styled(Link)<{ $variant?: Variant }>`
  min-height: 56px;
  padding: 0 28px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background: ${({ theme }) => theme.colors.action.primary};
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.action.primaryText};
  font-size: 18px;
  font-weight: 500;
  line-height: 1;

  transition: background-color 0.3s, transform 0.3s;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.action.primaryHover};
      transform: translateY(-1px);
    }
  }

  &:active {
    background: ${({ theme }) => theme.colors.action.primaryActive};
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
  }

  ${({ $variant }) => $variant === 'secondary' && secondaryStyles};
`

export default LinkUI
