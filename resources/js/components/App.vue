<template>
    <div class="poker-hands">
        <h1>5 card studd </h1>
        <fieldset v-if="showGameSettings">
            <div class="field">
                <label for="playersName">
                    <span>Add your name:</span>
                    <input
                        name="playersName"
                        type="text"
                        v-model="playersName"
                        @focus="clearErrors"
                    />
                </label>
                <small v-if="invalidInput.playersName">Please include a name greater than 3 characters.</small>
            </div>
            <div class="field">
                <label for="numberOfPlayers">
                    <span>Number of players:</span>
                    <input
                        min="1"
                        max="5"
                        name="numberOfPlayers"
                        type="range"
                        v-model="numberOfPlayers"
                        @change="clearErrors"
                    />
                    <input
                        readonly
                        type="number"
                        v-model="numberOfPlayers"
                    />
                </label>
                <small v-if="invalidInput.numberOfPlayers">The number of players must be between 1 and 5.</small>
            </div>
            <button
                @click.stop="handleClickStart"
                class="btn btn-primary"
                :disabled="invalidInput.playersName || invalidInput.playersName"
            >Start</button>
            <!-- <div>{{invalidInput}}</div> -->
        </fieldset>
        <template v-if="players && !showGameSettings">
            <PlayersCards />
            <template v-if="message">
                <button
                    @click.stop="handClickDealAgain"
                    class="btn btn-primary"
                    style="width: 100%;"
                >Deal Again</button>
                <h3 v-text="message"></h3>
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
import PlayersCards from './PlayersCards.vue'
export default {
    name: "Poker-Hands",
    components: { PlayersCards },
    props: {
        playerItems: {
            type: Array,
        }
    },
    setup() {
        const pokerHands = usePokerHandsStore()
        const { players, playersName, showGameSettings, numberOfPlayers, message, invalidInput, } = storeToRefs(pokerHands)
        const { dealCards, addPlayers, addSinglePlayer, winningHand, resetGame, clearErrors, } = pokerHands
        return {
            players, playersName, showGameSettings, numberOfPlayers, message, invalidInput,
            dealCards, addPlayers, addSinglePlayer, winningHand, resetGame, clearErrors,
        }
    },
    methods: {
        async handleClickStart() {
            if (this.playersName.length < 3){
                this.invalidInput.playersName = true
            }
            if (this.numberOfPlayers < 1 || this.numberOfPlayers > 5){
                this.invalidInput.numberOfPlayers = true
            }
            if (!this.invalidInput.playersName && !this.invalidInput.playersName){
                await this.addSinglePlayer()
                await this.addPlayers()
                this.showGameSettings = false
                this.dealCards()
            }
        },
        async handClickDealAgain(){
            await this.resetGame();
            this.dealCards()
        },
    },
}
</script>
