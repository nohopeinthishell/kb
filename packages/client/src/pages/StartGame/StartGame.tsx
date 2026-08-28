import { Helmet } from 'react-helmet-async'
import styled from 'styled-components'

import { ROUTES } from '../../constants/routes'
import LinkUI from '../../ui/LinkUI'

const weekSteps = [
  {
    number: '1',
    title: 'Разберитесь с событием',
    text: 'Каждую неделю в таверне что-то происходит. Выберите один из вариантов и сразу увидите цену решения.',
  },
  {
    number: '2',
    title: 'Подготовьте зал',
    text: 'Тратьте золото на ремонт столов, временного помощника и провизию — но не оставляйте казну пустой.',
  },
  {
    number: '3',
    title: 'Завершите неделю',
    text: 'Сверьтесь с прогнозом доходов и расходов, затем переходите дальше и смотрите, как изменится таверна.',
  },
]

export const StartGamePage = () => (
  <Page>
    <Helmet>
      <title>Как играть — Таверна</title>
      <meta
        name="description"
        content="Краткие правила экономической игры «Таверна»"
      />
    </Helmet>

    <Content>
      <Header>
        <Eyebrow>Перед открытием</Eyebrow>
        <Title>Продержитесь шесть недель</Title>
        <Lead>
          Управляйте придорожной таверной, принимайте решения и не дайте
          заведению разориться. Одна партия занимает 5–7 минут.
        </Lead>
      </Header>

      <Summary aria-label="Цель игры">
        <SummaryItem>
          <SummaryValue>6</SummaryValue>
          <SummaryLabel>игровых недель</SummaryLabel>
        </SummaryItem>
        <SummaryItem>
          <SummaryValue>2</SummaryValue>
          <SummaryLabel>главных показателя</SummaryLabel>
        </SummaryItem>
        <SummaryItem>
          <SummaryValue>1</SummaryValue>
          <SummaryLabel>цель — не разориться</SummaryLabel>
        </SummaryItem>
      </Summary>

      <RulesSection aria-labelledby="week-rules-title">
        <SectionTitle id="week-rules-title">Как проходит неделя</SectionTitle>
        <StepList>
          {weekSteps.map(step => (
            <Step key={step.number}>
              <StepNumber aria-hidden="true">{step.number}</StepNumber>
              <StepText>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.text}</StepDescription>
              </StepText>
            </Step>
          ))}
        </StepList>
      </RulesSection>

      <Indicators aria-labelledby="indicators-title">
        <SectionTitle id="indicators-title">
          Следите за показателями
        </SectionTitle>
        <IndicatorGrid>
          <Indicator>
            <IndicatorName $color="gold">Казна</IndicatorName>
            <IndicatorText>
              Оплачивает расходы и подготовку зала. Если золото уйдёт в минус,
              партия закончится.
            </IndicatorText>
          </Indicator>
          <Indicator>
            <IndicatorName $color="reputation">Репутация</IndicatorName>
            <IndicatorText>
              Определяет поток гостей. Довольные посетители поднимают её, а
              очереди и сломанные столы — снижают.
            </IndicatorText>
          </Indicator>
        </IndicatorGrid>
      </Indicators>

      <Tip>
        <TipLabel>Совет трактирщика</TipLabel>
        <TipText>
          Экономия сегодня может оставить таверну без гостей завтра. Иногда
          вовремя починенный стол ценнее золота в сундуке.
        </TipText>
      </Tip>

      <Actions>
        <StartLink to={ROUTES.game} $variant="primary">
          Начать игру <span aria-hidden="true">→</span>
        </StartLink>
        <BackLink to={ROUTES.main} $variant="secondary">
          Вернуться в меню
        </BackLink>
      </Actions>
    </Content>
  </Page>
)

const Page = styled.main`
  min-height: 100%;
  width: 100%;
  padding: clamp(24px, 5vw, 64px);
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.page};
`

const Content = styled.div`
  width: min(100%, 960px);
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4vw, 48px);
`

const Header = styled.header`
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
`

const Eyebrow = styled.p`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.game.gold};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.04em;
`

const Lead = styled.p`
  margin: 20px 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: clamp(17px, 2vw, 20px);
  line-height: 1.6;
`

const Summary = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.background.surface};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const SummaryItem = styled.div`
  min-height: 116px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.border.subtle};
  }

  @media (max-width: 640px) {
    min-height: 96px;

    & + & {
      border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
      border-left: 0;
    }
  }
`

const SummaryValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 32px;
  line-height: 1;
`

const SummaryLabel = styled.span`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;
`

const RulesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
`

const StepList = styled.ol`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  list-style: none;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const Step = styled.li`
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.surface};
`

const StepNumber = styled.span`
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.action.primaryText};
  background: ${({ theme }) => theme.colors.action.primary};
  font-size: 15px;
  font-weight: 700;
`

const StepText = styled.div`
  min-width: 0;
`

const StepTitle = styled.h3`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  line-height: 1.3;
`

const StepDescription = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 15px;
  line-height: 1.55;
`

const Indicators = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const IndicatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Indicator = styled.article`
  padding: 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
`

const IndicatorName = styled.h3<{ $color: 'gold' | 'reputation' }>`
  margin: 0;
  color: ${({ theme, $color }) =>
    $color === 'gold'
      ? theme.colors.game.gold
      : theme.colors.game.reputationUp};
  font-size: 20px;
`

const IndicatorText = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 15px;
  line-height: 1.6;
`

const Tip = styled.aside`
  padding: 24px;
  border-left: 4px solid ${({ theme }) => theme.colors.feedback.warning};
  border-radius: 0 14px 14px 0;
  background: ${({ theme }) => theme.colors.feedback.warningMuted};
`

const TipLabel = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 15px;
`

const TipText = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`

const Actions = styled.nav`
  width: min(100%, 460px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StartLink = styled(LinkUI)`
  font-size: 19px;
`

const BackLink = styled(LinkUI)``

export const initStartGamePage = async () => Promise.resolve()
