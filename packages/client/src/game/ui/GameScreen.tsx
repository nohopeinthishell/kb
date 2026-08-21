import { useState } from 'react'
import styled from 'styled-components'

import { applyAction, GameAction, initialGameState, tick } from '../core'
import TavernCanvas from './TavernCanvas'

const GameScreen = () => {
  const [state, setState] = useState(initialGameState)

  const handleNextWeek = () => {
    setState(currentState => tick(currentState))
  }

  const handleApplyAction = (type: GameAction) => {
    setState(currentState => applyAction(currentState, type))
  }

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

      <Controls>
        <ActionButton
          type="button"
          onClick={() => handleApplyAction({ type: 'repairTable' })}
          disabled={state.status !== 'playing'}>
          Починить стол
        </ActionButton>

        <ActionButton
          type="button"
          onClick={() => handleApplyAction({ type: 'hireHelper' })}
          disabled={state.status !== 'playing'}>
          Нанять помощника
        </ActionButton>

        <ActionButton
          type="button"
          onClick={() => handleApplyAction({ type: 'buyProvision' })}
          disabled={state.status !== 'playing'}>
          Закупить провизию
        </ActionButton>

        <NextWeekButton
          type="button"
          onClick={handleNextWeek}
          disabled={state.status !== 'playing'}>
          {state.status === 'playing'
            ? 'Следующая неделя'
            : state.status === 'won'
            ? 'Победа'
            : 'Поражение'}
        </NextWeekButton>
      </Controls>
    </Page>
  )
}

const Page = styled.main`
  box-sizing: border-box;
  width: min(100%, 1048px);
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  overflow: hidden;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
`

const Controls = styled.div`
  display: flex;
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
