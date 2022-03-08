import styled from '@emotion/styled'
import { useRef } from 'react'
import Game from '../game/game'
import NxWelcome from './nx-welcome'

const StyledApp = styled.div`
  // Your style here
`

export function App() {
  const node = useRef<HTMLElement | null>()
  const game = useRef<Game | undefined>()
  const onNode = (ref: HTMLElement | null) => {
    if (ref) {
      node.current = ref
      game.current = new Game(ref)
    }
  }
  return (
    <StyledApp>
      <div ref={onNode} />
    </StyledApp>
  )
}

export default App
