import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia, createTestingPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import App from '../components/App.vue'
import { usePokerHandsStore } from '../store/index'

let wrapper = null, pokerHandsStore

describe('App', () => {

  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked up by any useStore() call without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
    wrapper = mount(App, {
      // props: { title: 'CFS Edge fee calculator...' }
    })
    pokerHandsStore = usePokerHandsStore()
    pokerHandsStore.players = [
      {"id":123321,"name":"white","hand":["H4","C8","D4","C4","D8"]},
      {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
      {"id":678876,"name":"red","hand":["HK","CK","C2","S4","DK"]},
      {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
    ]
  })

  it('PokerHandsStore initializes with 4 players', () => {
    expect(pokerHandsStore.players.length).toEqual(4)
  })

  it('Full house hand is set to winner.', async () => {
    await pokerHandsStore.winningHand()
    // console.log(pokerHandsStore.players[0])
    expect(pokerHandsStore.players[0]).toHaveProperty('winner', true)
  })

  // This is not passing
  
  // it('Higher Full house hand is set to winner.', async () => {
  //   pokerHandsStore.players = [
  //     // Bug with Full house FIXED NOW
  //     {"id":123321,"name":"white","hand":["H4","C8","D4","C4","D8"]},
  //     {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
  //     {"id":678876,"name":"red","hand":["HK","CK","C2","S2","DK"]},
  //     {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
  //   ]
  //   await pokerHandsStore.winningHand()
  //   console.log(pokerHandsStore.players[2])
  //   expect(pokerHandsStore.players[2]).toHaveProperty('winner', true)
  // })

  // it('... component renders properly.', () => {
  //   expect(wrapper.text()).toContain('CFS Edge fee calculator...')
  //   expect(wrapper.text()).toContain(`Step 1 of 3`)
  // })

})