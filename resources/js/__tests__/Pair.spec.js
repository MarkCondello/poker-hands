import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import App from '../components/App.vue'
import { usePokerHandsStore } from '../store/index'

let wrapper = null, pokerHandsStore

describe('App', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked up by any useStore() call without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
    wrapper = mount(App, {
      // attrs for the component like props can be added here
    })
    pokerHandsStore = usePokerHandsStore()
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H9","S5","D4","C2","D9"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C7","S3","SA"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
  })

  it('High pair hand is set to winner.', async () => {
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  })

  it('Multiple pair hands with the same value are set to split pot winner.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H7","SK","DK","C3","DA"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C7","S3","SA"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[0]).toHaveProperty('splitPotWinner', true)
    expect(pokerHandsStore.players[2]).toHaveProperty('splitPotWinner', true)
  })

  // // Need to check kicker hands with same hands
  it('Higher kicker of multiple pair hands wins.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H7","SK","DK","C3","DJ"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C7","S3","SA"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  })

  it('Two of a kind hands beats a high card.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H7","SK","DK","C3","DJ"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C7","S3","SQ"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  })
})