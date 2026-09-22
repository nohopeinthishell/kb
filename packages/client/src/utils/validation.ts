export type FieldValidator = (value: string) => string | null

const NAME_PATTERN = /^[A-ZА-ЯЁ][A-Za-zА-яЁё-]*$/
const LOGIN_PATTERN = /^(?!\d+$)[A-Za-z0-9_-]+$/
const EMAIL_PATTERN = /^[A-Za-z0-9._+-]+@[A-Za-z]+\.[A-Za-z]+$/
const PASSWORD_PATTERN = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,40}$/
const PHONE_PATTERN = /^\+?\d{10,15}$/

const NAME_ERROR = 'Первая буква должна быть заглавной; допустимы буквы и дефис'

export const validateName: FieldValidator = value =>
  NAME_PATTERN.test(value) ? null : NAME_ERROR

export const validateLogin: FieldValidator = value => {
  if (value.length < 3 || value.length > 20) {
    return 'Логин должен содержать от 3 до 20 символов'
  }

  return LOGIN_PATTERN.test(value)
    ? null
    : 'Допустимы латинские буквы, цифры, дефис и нижнее подчёркивание; логин не может состоять только из цифр'
}

export const validateEmail: FieldValidator = value =>
  EMAIL_PATTERN.test(value)
    ? null
    : 'Введите email латиницей в формате name@example.com'

export const validatePassword: FieldValidator = value =>
  PASSWORD_PATTERN.test(value)
    ? null
    : 'Пароль должен содержать от 8 до 40 символов, хотя бы одну заглавную букву и цифру'

export const validatePhone: FieldValidator = value =>
  PHONE_PATTERN.test(value) ? null : 'Телефон должен состоять из 10–15 цифр'

export const validationRules = {
  first_name: validateName,
  second_name: validateName,
  login: validateLogin,
  email: validateEmail,
  password: validatePassword,
  phone: validatePhone,
} as const
