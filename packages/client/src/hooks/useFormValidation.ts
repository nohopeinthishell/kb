import { FocusEvent, FormEvent, useCallback, useState } from 'react'

import type { FieldValidator } from '../utils/validation'

type ValidationErrors<TField extends string> = Partial<Record<TField, string>>

export const useFormValidation = <TField extends string>(
  validators: Record<TField, FieldValidator>
) => {
  const [errors, setErrors] = useState<ValidationErrors<TField>>({})

  const validateField = useCallback(
    (field: TField, value: string) => {
      const error = value === '' ? null : validators[field](value)

      setErrors(current => {
        const next = { ...current }

        if (error) next[field] = error
        else delete next[field]

        return next
      })

      return !error
    },
    [validators]
  )

  const validateForm = useCallback(
    (values: Record<TField, string>) => {
      const nextErrors: ValidationErrors<TField> = {}

      for (const field of Object.keys(validators) as TField[]) {
        const error = validators[field](values[field])
        if (error) nextErrors[field] = error
      }

      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
    },
    [validators]
  )

  const setFieldError = useCallback((field: TField, error: string) => {
    setErrors(current => ({ ...current, [field]: error }))
  }, [])

  const getFieldValidationProps = useCallback(
    (field: TField) => ({
      error: errors[field],
      onBlur: (event: FocusEvent<HTMLInputElement>) =>
        validateField(field, event.currentTarget.value),
      onInput: (event: FormEvent<HTMLInputElement>) => {
        if (event.currentTarget.value !== '') return

        setErrors(current => {
          if (!current[field]) return current

          const next = { ...current }
          delete next[field]
          return next
        })
      },
      onFocus: () =>
        setErrors(current => {
          if (!current[field]) return current

          const next = { ...current }
          delete next[field]
          return next
        }),
    }),
    [errors, validateField]
  )

  return {
    errors,
    getFieldValidationProps,
    setFieldError,
    validateForm,
  }
}
