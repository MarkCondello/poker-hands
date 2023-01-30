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
      {"id":123321,"name":"white","hand":["H4","C8","D4","CA","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","D2","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HQ","C5","C2","S2","DK"]},
      {"id":3867,"name":"blue","hand":["C10","CJ","CQ","CK","C1"]},
    ]
  })

  // Flush checks start
  it('Flush hand is set to winner.', async () => {
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[3]).toHaveProperty('winner', true)
  })


  it('Flush hand beats straight hand.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["HA","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","D2","C7","HJ"]},
      {"id":678876,"name":"red","hand":["D9","D10","DJ","DQ","SK"]},
      {"id":3867,"name":"blue","hand":["C10","CJ","CQ","CK","C2"]},
    ]
    await pokerHandsStore.winningHand()
    console.log(pokerHandsStore.players)
    expect(pokerHandsStore.players[3]).toHaveProperty('winner', true)
  })


  it('Flush high hands result in split pot.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H2","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","D2","C7","HJ"]},
      {"id":678876,"name":"red","hand":["D10","DJ","DQ","DK", "D2"]},
      {"id":3867,"name":"blue","hand":["C10","CJ","CQ","CK","C2"]}
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('splitPotWinner', true)
    expect(pokerHandsStore.players[3]).toHaveProperty('splitPotWinner', true)
  })
  // Flush checks end
})