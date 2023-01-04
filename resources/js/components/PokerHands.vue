<template>
    <div class="poker-hands">
        <h1>POKER HANDS</h1>
        <template v-if="players.length && showAddPlayer">
            <label for="playersName">Add your name:</label>
            <input type="text" v-model="playersName" name="playersName"/>
            <button @click.stop="handleClickStart">Start</button>
        </template>
        <template v-if="players[0].hand.length">
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
                @click.stop="handleGetWinner"
                class="btn btn-primary"
            >Who wins?</button>
        </template>
     </div>
</template>

<script>
import { mapState, mapActions } from "pinia"
import { usePokerHandsStore } from "../store/index"
// import { mapState, mapActions } from "vuex";
export default {
    name: "Poker-Hands",
    props: {
        playerItems: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            playersName: '',
            showAddPlayer: true,
        }
    },
    created() {
        this.addPlayers({players: this.playerItems})
    },
    computed: {
        ...mapState(usePokerHandsStore, ['players', 'message']),
    },
    methods: {
        ...mapActions(usePokerHandsStore, ['dealCards', 'addPlayers', 'addSinglePlayer', 'winningHand', 'resetGame']),
        async handleClickStart(){
             if(this.playersName.length > 3){
                await this.addSinglePlayer(this.playersName)
                this.showAddPlayer = false
                this.dealCards()
            }
        },
        async handClickDealAgain(){
            await this.resetGame();
            this.dealCards()
        },
        handleGetWinner(){
            this.winningHand()
        },
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
