import styled from 'styled-components'
import { Link } from 'react-router-dom'

const BackLink = styled(Link)`
  align-self: start;

  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.text.link};
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
    border-radius: 4px;
  }
`

export default BackLink
