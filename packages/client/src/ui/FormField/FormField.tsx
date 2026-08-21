import { ComponentPropsWithoutRef, useId } from 'react'
import styled from 'styled-components'

type FormFieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'id' | 'className'
> & {
  label: string
  error?: string
}

export default function FormField({
  label,
  error,
  ...inputProps
}: FormFieldProps) {
  const generatedId = useId()

  const fieldId = `field-${generatedId}`
  const errorId = `${fieldId}-error`

  return (
    <Field>
      <Label htmlFor={fieldId}>{label}</Label>
      <Input className={error && 'error'} {...inputProps} id={fieldId} />
      {error && (
        <Error id={errorId} role="alert">
          {error}
        </Error>
      )}
    </Field>
  )
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  font-weight: 500;
`

const Input = styled.input`
  height: 48px;
  width: 100%;

  padding: 0 14px;

  background: ${({ theme }) => theme.colors.background.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 10px;

  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: 16px;

  transition: border-color 0.3s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  @media (hover: hover) {
    &:hover:not(.error) {
      border-color: ${({ theme }) => theme.colors.border.strong};
    }
  }

  &:focus:not(.error) {
    border-color: ${({ theme }) => theme.colors.border.focus};
    outline: none;
  }

  &.error {
    border-color: ${({ theme }) => theme.colors.feedback.danger};
  }
`

const Error = styled.span`
  color: ${({ theme }) => theme.colors.feedback.danger};
  font-size: 13px;
  line-height: 1.4;
`
