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
      {"id":123321,"name":"white","hand":["H4","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C2","S4","DK"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
  })

  // Royal flush checks start
  it('Royal Flush hand is set to winner.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H4","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","D2","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","C5","C2","S2","DK"]},
      {"id":3867,"name":"blue","hand":["C10","CJ","CQ","CK","CA"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[3]).toHaveProperty('winner', true)
  })
  it('Royal Flush hand beats straight flush hand.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H4","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","D2","C7","HJ"]},
      {"id":678876,"name":"red","hand":["D9","D10","DJ","DQ","DK"]},
      {"id":3867,"name":"blue","hand":["C10","CJ","CQ","CK","CA"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[3]).toHaveProperty('winner', true)
  })
  it('Multiple Royal Flush high hands result in split pot.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H2","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","D2","C7","HJ"]},
      {"id":678876,"name":"red","hand":["D10","DJ","DQ","DK", "DA"]},
      {"id":3867,"name":"blue","hand":["C10","CJ","CQ","CK","CA"]}
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('splitPotWinner', true)
    expect(pokerHandsStore.players[3]).toHaveProperty('splitPotWinner', true)
  })
  // Royal flush checks end
})