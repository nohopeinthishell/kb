import styled from 'styled-components'

import { ROUTES } from '../../constants/routes'
import LinkUI from '../../ui/LinkUI'
import { calculateScore } from '../core/score'

type GameOverScreenProps = {
  status: 'won' | 'lost'
  money: number
  reputation: number
  onPlayAgain: () => void
}

const GameOverScreen = ({
  status,
  money,
  reputation,
  onPlayAgain,
}: GameOverScreenProps) => {
  const score = calculateScore(money, reputation)
  const isVictory = status === 'won'

  return (
    <Backdrop role="presentation">
      <Dialog role="dialog">
        <Eyebrow>
          {isVictory ? 'Шесть недель позади' : 'Казна опустела'}
        </Eyebrow>
        <Title id="game-over-title" $isVictory={isVictory}>
          {isVictory ? 'Победа!' : 'Поражение'}
        </Title>
        <Description id="game-over-description">
          {isVictory
            ? 'Таверна пережила все шесть недель. Посмотрите, как сложились итоги партии.'
            : 'Золото ушло в минус — таверна закрылась. Попробуйте ещё раз с другими решениями.'}
        </Description>

        <Stats aria-label="Итоги партии">
          <Stat>
            <StatLabel>Казна</StatLabel>
            <StatValue $color="gold">{money}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Репутация</StatLabel>
            <StatValue $color="reputation">{reputation}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Итоговый счёт</StatLabel>
            <StatValue>{score}</StatValue>
          </Stat>
        </Stats>

        <Actions>
          <PlayAgainButton type="button" onClick={onPlayAgain}>
            Сыграть ещё
          </PlayAgainButton>
          <MenuLink to={ROUTES.main} $variant="secondary">
            В главное меню
          </MenuLink>
        </Actions>
      </Dialog>
    </Backdrop>
  )
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
  padding: clamp(16px, 4vw, 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.overlay};
`

const Dialog = styled.div`
  width: min(100%, 480px);
  padding: clamp(24px, 5vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.background.surface};
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
`

const Eyebrow = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const Title = styled.h2<{ $isVictory: boolean }>`
  margin: 0;
  color: ${({ theme, $isVictory }) =>
    $isVictory ? theme.colors.feedback.success : theme.colors.feedback.danger};
  font-size: clamp(28px, 5vw, 36px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 15px;
  line-height: 1.6;
`

const Stats = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const Stat = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
`

const StatLabel = styled.dt`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
`

const StatValue = styled.dd<{ $color?: 'gold' | 'reputation' }>`
  margin: 0;
  color: ${({ theme, $color }) => {
    if ($color === 'gold') return theme.colors.game.gold
    if ($color === 'reputation') return theme.colors.game.reputationUp
    return theme.colors.text.primary
  }};
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
`

const Actions = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PlayAgainButton = styled.button`
  min-height: 56px;
  padding: 0 28px;
  border: 0;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.action.primaryText};
  background: ${({ theme }) => theme.colors.action.primary};
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.action.primaryHover};
      transform: translateY(-1px);
    }
  }

  &:active {
    background: ${({ theme }) => theme.colors.action.primaryActive};
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 4px;
  }
`

const MenuLink = styled(LinkUI)`
  width: 100%;
`

export default GameOverScreen
