import type { PageInitArgs } from '../../routes'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { ROUTES } from '../../constants/routes'
import { usePage } from '../../hooks/usePage'
import { initAuth } from '../../modules/auth'
import { fetchLeaderboard } from '../../modules/leaderboard'

import {
  selectLeaderboardError,
  selectLeaderboardHasMore,
  selectLeaderboardIsLoading,
  selectLeaderboardRecords,
} from '../../slices/leaderboardSlice'
import { useDispatch, useSelector } from '../../store'

export const LeaderboardPage = () => {
  const records = useSelector(selectLeaderboardRecords)
  const isLoading = useSelector(selectLeaderboardIsLoading)
  const error = useSelector(selectLeaderboardError)
  const hasMore = useSelector(selectLeaderboardHasMore)
  const dispatch = useDispatch()

  usePage({
    initPage: initLeaderboardPage,
    revalidateOnClient: true,
  })

  const navigate = useNavigate()

  return (
    <Page>
      <Helmet>
        <title>Лидерборд | Таверна</title>
      </Helmet>
      <PageHeader>
        <BackButton type="button" onClick={() => navigate(ROUTES.main)}>
          <Arrow aria-hidden="true">←</Arrow>На главную
        </BackButton>
        <HeadingGroup>
          <Title>Лидерборд</Title>
          <Description>
            Лучшие результаты игроков после шести недель в таверне
          </Description>
        </HeadingGroup>
      </PageHeader>
      <Content>
        <Card>
          <SectionHeader>
            <div>
              <SectionTitle>Таблица рекордов</SectionTitle>
              <SectionDescription>
                Итоговый счёт считается из казны и репутации после шести недель
              </SectionDescription>
            </div>
          </SectionHeader>
          {isLoading && records.length === 0 && (
            <Message>Загрузка результатов…</Message>
          )}
          {error && (
            <Message role="alert">
              Не удалось загрузить результаты: {error}
            </Message>
          )}
          {!isLoading && !error && records.length === 0 && (
            <Message>Пока нет результатов.</Message>
          )}
          {records.length > 0 && (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <HeaderCell>#</HeaderCell>
                    <HeaderCell>Игрок</HeaderCell>
                    <HeaderCell>Счёт</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.data.userId}>
                      <Cell>{index + 1}</Cell>
                      <Cell>{record.data.name}</Cell>
                      <Cell>{record.data.score}</Cell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
          {(error || (hasMore && records.length > 0)) && (
            <LoadButton
              type="button"
              disabled={isLoading}
              onClick={() =>
                void dispatch(fetchLeaderboard({ cursor: records.length }))
              }>
              {error
                ? 'Повторить загрузку'
                : isLoading
                ? 'Загрузка…'
                : 'Показать ещё'}
            </LoadButton>
          )}
        </Card>
      </Content>
    </Page>
  )
}

export const initLeaderboardPage = async (args: PageInitArgs) => {
  await initAuth(args)

  await args.dispatch(fetchLeaderboard({ cookie: args.ctx.cookie }))
}

const Page = styled.main`
  box-sizing: border-box;
  min-height: 100%;
  padding: 48px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background.page};
`

const PageHeader = styled.header`
  flex: 0 0 auto;
  width: min(100%, 1080px);
  margin: 0 auto 32px;
`

const BackButton = styled.button`
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font: inherit;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
  }
`

const Arrow = styled.span`
  font-size: 22px;
`

const HeadingGroup = styled.div`
  margin-top: 28px;
`

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 44px;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 17px;
`

const Content = styled.div`
  width: min(100%, 1080px);
  min-height: 0;
  margin: 0 auto;
  display: flex;
  flex: 1;
`

const Card = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
  padding: 32px;
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.surface};
`

const SectionHeader = styled.div`
  margin-bottom: 28px;
`

const SectionTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 22px;
`

const SectionDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`

const TableWrapper = styled.div`
  min-height: 0;
  overflow: auto;
  flex: 1;
  scrollbar-color: ${({ theme }) =>
    `${theme.colors.border.strong} ${theme.colors.background.surface}`};
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.surface};
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid ${({ theme }) => theme.colors.background.surface};
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.border.strong};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.action.primary};
  }
`

const Table = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
`

const HeaderCell = styled.th`
  padding: 0 16px 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 600;
  text-align: left;

  &:last-child {
    padding-right: 0;
  }
`

const Cell = styled.td`
  padding: 18px 16px 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  vertical-align: top;

  &:last-child {
    padding-right: 0;
  }
`

const Message = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`

const LoadButton = styled(BackButton)`
  margin-top: 24px;
  align-self: flex-start;
`
