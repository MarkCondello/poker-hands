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

  // Full house checks start
  it('Full house hand is set to winner.', async () => {
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[0]).toHaveProperty('winner', true)
  })
  it('Higher Full house hand is set to winner.', async () => {
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H4","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","D2","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C2","S2","DK"]},
      {"id":3867,"name":"blue","hand":["SA","S5","C5","CA","DA"]},
    ]
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[3]).toHaveProperty('winner', true)
  })


  // Full house beats a flush --
  
  // Full house checks end
})