export { authenticate, getAuthenticatedUser } from './authenticate'
export type { AuthenticatedUser, AuthenticatedLocals } from './authenticate'
export {
  courseApiProxy,
  COURSE_API_URL,
  rewriteSessionCookie,
} from './courseApiProxy'
export type { CourseApiOptions } from './courseApiProxy'
export { filterCourseApiCookies } from './filterCourseApiCookies'
