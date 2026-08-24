import styled from 'styled-components'

type EventCardData = {
  id: string
  title: string
  description: string
  choices: Array<{
    id: string
    label: string
    hint: string
  }>
}

type EventCardProps = {
  event: EventCardData | null
  disabled: boolean
  onChoice: (choiceId: string) => void
}

const EventCard = ({ event, disabled, onChoice }: EventCardProps) => {
  if (!event) {
    return (
      <Card aria-live="polite">
        <Title>Спокойная неделя</Title>
        <Description>На этой неделе особых событий нет.</Description>
      </Card>
    )
  }

  return (
    <Card aria-live="polite">
      <Title>{event.title}</Title>
      <Description>{event.description}</Description>

      <Choices>
        {event.choices.map(choice => (
          <ChoiceButton
            key={choice.id}
            type="button"
            disabled={disabled}
            onClick={() => onChoice(choice.id)}>
            <ChoiceLabel>{choice.label}</ChoiceLabel>
            <ChoiceHint>{choice.hint}</ChoiceHint>
          </ChoiceButton>
        ))}
      </Choices>
    </Card>
  )
}

const Card = styled.section`
  padding: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.surface};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`

const Description = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`

const Choices = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 20px;
`

const ChoiceButton = styled.button`
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  background: ${({ theme }) => theme.colors.action.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.action.secondaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
    background: ${({ theme }) => theme.colors.action.disabled};
    cursor: default;
  }
`

const ChoiceLabel = styled.span`
  font-weight: 600;
`

const ChoiceHint = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`

export default EventCard
