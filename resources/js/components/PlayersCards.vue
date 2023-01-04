<template>
 <div class="container">
    <article v-for="(player, pid) in players" :key="pid">
      <h2>{{player.name}}</h2>
      <ul class="hand">
        <li
          v-for="(card, cid) in player.hand"
          :key="pid + cid"
          class="card"
          :style="`color:${cardColor(card[0])}`"
        >
          <div>
            <span>{{card.slice(1)}}</span>
            <span v-html="cardSuit(card[0])"></span>
          </div>
          <div>
            <span>{{card.slice(1)}}</span>
            <span v-html="cardSuit(card[0])"></span>
          </div>
        </li>
      </ul>
    </article>
  </div>
</template>

<script>
import { storeToRefs } from "pinia"
import { usePokerHandsStore } from "../store/index"
export default {
  name: "PlayersCards",
  setup() {
      const pokerHands = usePokerHandsStore()
      const { players } = storeToRefs(pokerHands)
      return { players }
  },
  methods: {
    cardSuit(suit){
        switch(suit){
          case('H'):
              return '&hearts;';
          case('S'):
              return '&spades;';
          case('D'):
              return '&diams;';
          case('C'):
              return '&clubs;';
        }
      },
      cardColor(suit){
        switch(suit){
            case('H'):
            case('D'):
                return '#F00';
            case('S'):
            case('C'):
                return '#000;';
        }
      }
  }
}
</script>