import { request } from './auth'
import type { User } from './auth'

export type UpdateProfileRequest = Pick<
  User,
  'first_name' | 'second_name' | 'display_name' | 'login' | 'email' | 'phone'
>

export type ChangePasswordRequest = {
  oldPassword: string
  newPassword: string
}

export function updateProfile(data: UpdateProfileRequest) {
  return request<User>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function updateAvatar(avatar: File) {
  const formData = new FormData()
  formData.append('avatar', avatar)

  return request<User>('/user/profile/avatar', {
    method: 'PUT',
    body: formData,
  })
}

export function changePassword(data: ChangePasswordRequest) {
  return request('/user/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
