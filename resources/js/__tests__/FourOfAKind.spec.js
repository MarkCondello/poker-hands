

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
      {"id":123321,"name":"white","hand":["H4","S4","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C2","SA","DK"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
  })

  // Four of a kind start
  it('Four of a kind hand is set to winner.', async () => {
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[0]).toHaveProperty('winner', true)
  })
  it('Higher four of a kind hand is set to winner.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H4","S4","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","SK","SA","DK"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  })
  it('Four of a kind hand beats full house.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H4","S4","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","S3","DA","CA","HA"]},
      {"id":678876,"name":"red","hand":["HK","CK","SK","SA","DK"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  })
  // Four of a kind end
})