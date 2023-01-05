import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
// import { mount } from '@vue/test-utils'

// import Header from '../Header.vue'
import { usePokerHandsStore } from '../store/index'

let //wrapper = null,
pokerHandsStore
describe('Header', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
    pokerHandsStore = usePokerHandsStore()
    // wrapper = mount(Header, {
    //   props: { title: 'CFS Edge fee calculator...' }
    // })
  })

  it('PokerHandsStore initializes with 5 opponents', () => {
    expect(pokerHandsStore.numberOfPlayers).toBe(5)
  })

  // it('... component renders properly.', () => {
  //   expect(wrapper.text()).toContain('CFS Edge fee calculator...')
  //   expect(wrapper.text()).toContain(`Step 1 of 3`)
  // })

})