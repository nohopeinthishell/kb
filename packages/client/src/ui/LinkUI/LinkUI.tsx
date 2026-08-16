import { Link, LinkProps } from 'react-router-dom'
import styled from 'styled-components'

type LinkUIProps = Omit<LinkProps, 'to'> & {
  to?: LinkProps['to']
}

const LinkUI = ({ to = '/', children, ...props }: LinkUIProps) => {
  return (
    <LinkComponent to={to} {...props}>
      {children}
    </LinkComponent>
  )
}

export default LinkUI

const LinkComponent = styled(Link)`
  min-height: 56px;
  padding: 0 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.action.primaryText};
  background: ${({ theme }) => theme.colors.action.primary};
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  transition: background-color 160ms ease, transform 160ms ease;

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
`
