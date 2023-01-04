<template>
    <div class="poker-hands">
        <h1>POKER HANDS</h1>
        <template v-if="showGameSettings">
            <div class="field">
                <label for="playersName">Add your name:</label>
                <input type="text" v-model="playersName" name="playersName"/>
            </div>
            <div class="field">
                <label for="numberOfPlayers">Number of players:</label>
                <input type="number" v-model="numberOfPlayers" name="numberOfPlayers"/>
            </div>
            <button @click.stop="handleClickStart">Start</button>
        </template>
        <template v-if="players && !showGameSettings">
            <!-- Convert to component -->
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
            <template v-if="message">
                <h3 v-text="message"></h3>
                <button
                    @click.stop="handClickDealAgain"
                    class="btn btn-primary"
                    style="width: 100%;"
                >Deal Again</button>
            </template>
            <button
                v-else
                style="width: 100%;"
                @click.stop="winningHand"
                class="btn btn-primary"
            >Who wins?</button>
        </template>
     </div>
</template>

<script>
import { storeToRefs } from "pinia"
import { usePokerHandsStore } from "../store/index"
export default {
    name: "Poker-Hands",
    setup() {
        const pokerHands = usePokerHandsStore()
        const { players, playersName, showGameSettings, numberOfPlayers, message } = storeToRefs(pokerHands)
        const { dealCards, addPlayers, addSinglePlayer, winningHand, resetGame } = pokerHands
        return {
            players, playersName, showGameSettings, numberOfPlayers, message,
            dealCards, addPlayers, addSinglePlayer, winningHand, resetGame,
        }
    },
    methods: {
        async handleClickStart() {
            // ToDo: Add store Validation for inputs

            if (this.playersName.length > 3){
                await this.addSinglePlayer()
                await this.addPlayers()
                this.showGameSettings = false
                this.dealCards()
            } else {
                // Show userName error message
            }
        },
        async handClickDealAgain(){
            await this.resetGame();
            this.dealCards()
        },
        // Move to component
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
    },
}
</script>
