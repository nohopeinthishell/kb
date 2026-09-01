import { useEffect } from 'react'
import { useDispatch, useSelector, useStore } from '../store'
import {
  setPageHasBeenInitializedOnServer,
  selectPageHasBeenInitializedOnServer,
} from '../slices/ssrSlice'
import { PageInitArgs, PageInitContext } from '../routes'

const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

const createContext = (): PageInitContext => ({
  clientToken: getCookie('token'),
})

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown>
  revalidateOnClient?: boolean
}

export const usePage = ({
  initPage,
  revalidateOnClient = false,
}: PageProps) => {
  const dispatch = useDispatch()
  const pageHasBeenInitializedOnServer = useSelector(
    selectPageHasBeenInitializedOnServer
  )
  const store = useStore()

  useEffect(() => {
    if (pageHasBeenInitializedOnServer) {
      dispatch(setPageHasBeenInitializedOnServer(false))
      if (revalidateOnClient) {
        initPage({ dispatch, state: store.getState(), ctx: createContext() })
      }
      return
    }
    initPage({ dispatch, state: store.getState(), ctx: createContext() })
  }, [])
}
