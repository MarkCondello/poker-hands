

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
      {"id":123321,"name":"white","hand":["H4","S2","D4","C2","D8"]},

      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C7","S3","D3"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
  })

  it('Higher two of a kind hand is set to winner.', async () => {
    await pokerHandsStore.winningHand()
    expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  })
  
  // it('Three of a kind hand beats two pair.', async () => {
  //   pokerHandsStore.players = [
  //     {"id":123321,"name":"white","hand":["H4","S2","D4","C2","D8"]},
  //     {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
  //     {"id":678876,"name":"red","hand":["HK","CK","C7","SA","DK"]},
  //     {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
  //   ]
  //   await pokerHandsStore.winningHand()
  //   expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  // })
})

// Need to check kicker hands with same hands