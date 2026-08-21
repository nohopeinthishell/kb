import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FormLink = styled(Link)`
  align-self: center;
  color: ${({ theme }) => theme.colors.text.link};
  font-size: 14px;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
  }
`

export default FormLink
