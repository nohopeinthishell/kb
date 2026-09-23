import { useState } from 'react'
import styled from 'styled-components'

import {
  applyAction,
  calculateScore,
  createNewGameState,
  GameAction,
  tick,
} from '../core'
import { EVENTS } from '../core/events'
import EventCard from './EventCard'
import GameOverScreen from './GameOverScreen'
import TavernCanvas from './TavernCanvas'
import { addUserToLeaderboard } from '../../api'
import { useSelector } from '../../store'
import { selectUser } from '../../slices/userSlice'

const GameScreen = () => {
  const user = useSelector(selectUser)
  const [state, setState] = useState(createNewGameState)

  const handlePlayAgain = () => {
    setState(createNewGameState())
  }

  const handleNextWeek = () => {
    const nextState = tick(state)
    setState(nextState)

    if (state.status === 'playing' && nextState.status === 'won' && user) {
      const score = calculateScore(nextState.money, nextState.reputation)
      void addUserToLeaderboard({
        userId: user.id,
        name: user.display_name ?? user.login,
        score,
      })
    }
  }

  const handleApplyAction = (type: GameAction) => {
    setState(currentState => applyAction(currentState, type))
  }

  const currentEvent =
    EVENTS.find(event => event.id === state.currentEventId) ?? null
  const hasPendingEvent = state.eventPhase === 'pending'
  const isGameFinished = state.status !== 'playing'

  const handleEventChoice = (choiceId: string) => {
    if (!currentEvent) return

    handleApplyAction({
      type: 'event',
      eventId: currentEvent.id,
      choiceId,
    })
  }

  const isEveryTableNew = state.tavern.tables.every(t => t.condition === 'new')

  return (
    <Page>
      <StatusBar>
        <span>Неделя: {state.week} из 6</span>
        <span>Казна: {state.money}</span>
        <span>Репутация: {state.reputation}</span>
      </StatusBar>

      <CanvasFrame>
        <TavernCanvas state={state} />
      </CanvasFrame>

      <EventCard
        event={currentEvent}
        phase={state.eventPhase}
        onChoice={handleEventChoice}
      />

      <Controls>
        <ActionButton
          type="button"
          onClick={() => handleApplyAction({ type: 'repairTable' })}
          disabled={isGameFinished || hasPendingEvent || isEveryTableNew}>
          Починить стол
        </ActionButton>

        <ActionButton
          type="button"
          onClick={() => handleApplyAction({ type: 'hireHelper' })}
          disabled={
            isGameFinished || hasPendingEvent || state.tavern.helperActive
          }>
          Нанять помощника
        </ActionButton>

        <ActionButton
          type="button"
          onClick={() => handleApplyAction({ type: 'buyProvision' })}
          disabled={
            isGameFinished || hasPendingEvent || state.provisionWeeks > 0
          }>
          Закупить провизию
        </ActionButton>

        <NextWeekButton
          type="button"
          onClick={handleNextWeek}
          disabled={isGameFinished || hasPendingEvent}>
          Следующая неделя
        </NextWeekButton>
      </Controls>

      {isGameFinished && (
        <GameOverScreen
          status={state.status}
          money={state.money}
          reputation={state.reputation}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </Page>
  )
}

const Page = styled.main`
  box-sizing: border-box;
  width: min(100%, 1048px);
  height: 100vh;
  height: 100dvh;
  margin: 0 auto;
  padding: clamp(8px, 2.5vh, 24px);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vh, 16px);
  overflow: hidden;
`

const StatusBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surfaceMuted};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 12px;
`

const CanvasFrame = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
`

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
`

const ActionButton = styled.button`
  padding: 12px 20px;
  color: ${({ theme }) => theme.colors.action.primaryText};
  background: ${({ theme }) => theme.colors.action.primary};
  border: 0;
  border-radius: 8px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.action.primaryHover};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.action.primaryActive};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.action.disabledText};
    background: ${({ theme }) => theme.colors.action.disabled};
    cursor: default;
  }
`

const NextWeekButton = styled(ActionButton)`
  margin-left: auto;
`

export default GameScreen
