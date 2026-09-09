import type { PageInitArgs } from '../../routes'

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { ROUTES } from '../../constants/routes'
import { usePage } from '../../hooks/usePage'
import { initAuth } from '../../modules/auth'

import { MOCK_LEADERBOARD_RECORDS } from './mockRecords'

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage })

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
                Сравните казну, репутацию и исход партии с другими трактирщиками
              </SectionDescription>
            </div>
          </SectionHeader>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <HeaderCell>#</HeaderCell>
                  <HeaderCell>Игрок</HeaderCell>
                  <HeaderCell>Исход</HeaderCell>
                  <HeaderCell>Казна</HeaderCell>
                  <HeaderCell>Репутация</HeaderCell>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERBOARD_RECORDS.map((record, index) => (
                  <tr key={record.id}>
                    <Cell>{index + 1}</Cell>
                    <Cell>{record.name}</Cell>
                    <Cell>
                      <HighlightValue>
                        {record.isWin ? 'Победа' : 'Поражение'}
                      </HighlightValue>
                    </Cell>
                    <Cell>
                      <HighlightValue>{record.money} зол.</HighlightValue>
                    </Cell>
                    <Cell>
                      <HighlightValue>{record.reputation}</HighlightValue>
                    </Cell>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      </Content>
    </Page>
  )
}

export const initLeaderboardPage = async ({
  dispatch,
  state,
  ctx,
}: PageInitArgs) => initAuth({ dispatch, state, ctx })

const Page = styled.main`
  min-height: 100%;
  padding: 48px;
  background: ${({ theme }) => theme.colors.background.page};
`

const PageHeader = styled.header`
  width: 1080px;
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
  width: 1080px;
  margin: 0 auto;
`

const Card = styled.section`
  padding: 32px;
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
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
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

const HighlightValue = styled.span`
  color: ${({ theme }) => theme.colors.feedback.success};
  font-weight: 600;
`
