import { defineStore } from 'pinia'
import {deckOfCards, getHandValue, compareHighHands, animals, adjectives} from "../service/PokerHands"
import textFormatting from "../helpers/textFormatting"

export const usePokerHandsStore = defineStore('pokerHands', {
    state: () => ({
        deck: [...deckOfCards],
        playersName: '',
        showGameSettings: false,
        numberOfPlayers: 5,
        players: [
            // Bug with Full house FIXED NOW
            {"id":123321,"name":"white","hand":["H4","C8","D4","C4","D8"]},
            {"id":987789,"name":"black","hand":["D3","D6","DA","C7","HJ"]},
            {"id":678876,"name":"red","hand":["HK","CK","C2","S2","DK"]},
            {"id":3867,"name":"blue","hand":["DJ","S6","C5","CJ","D2"]},
        ],
        message: null,
        invalidInput: {
            playersName: false,
            numberOfPlayers: false,
        },
    }),
    actions: {
        clearErrors() {
            this.invalidInput.playersName = false
            this.invalidInput.numberOfPlayers = false
        },
        resetGame() {
            this.deck = [...deckOfCards]
            this.players = this.players.map(player => {
                player.hand = []
                return player
            });
            this.message = null
        },
        addPlayers() {
            for(let i = 0; i < this.numberOfPlayers; i++){
                this.players.push(
                    {
                        id: Math.floor(Math.random() * 1000),
                        name: `${textFormatting.ucFirst(adjectives[Math.floor(Math.random() * adjectives.length)])} ${animals[Math.floor(Math.random() * animals.length)]}`,
                        hand:[],
                    }
                )
            }
        },
        addSinglePlayer() {
            const player = {
                id: Math.floor(Math.random() * 100000),
                name: this.playersName,
                hand:[],
                showHand: true,
            }
            this.players.push(player)
        },
        dealCards(){
            let i = 0
            while(i < 5){
                for(let arrayId = 0; arrayId < this.players.length; arrayId++) {
                    const cardIndex = this.randomCardIndex,
                    card = this.getCard(cardIndex)
                    this.deck.splice(cardIndex, 1)
                    this.players[arrayId].hand.push(card)
                }
                i++
            }
        },
        async winningHand() {
            this.players.forEach((player, arrayId)=>{
                const rank = new getHandValue(player.hand).rank
                this.players[arrayId].handValue = rank
            });
            const matchingHighHands = await this.matchingHighHands;
            // console.log({matchingHighHands})
            if (matchingHighHands.length > 1 ) {
                const gameResult = new compareHighHands(matchingHighHands);
                  console.log("matchingHighHands.length > 1, Matching high hands check", {gameResult})
                if (gameResult.splitPotHands.length) {
                    const message = this.splitPotMessage(gameResult.splitPotHands),
                    playerIds = gameResult.splitPotHands.map(hand => hand.id)

                    this.message = message
                    playerIds.forEach(playerId=>{
                        this.players.forEach((player, index) => {
                            if(player.id === playerId){
                                this.players[index].splitPotWinner = true;
                            }
                        })
                    });
                } else {
                    const rank = await this.winningHandMessage(gameResult.highestHand)
                    this.players[gameResult.highestHand.arrayIndex].handValue = rank
                    const winnerIndex = this.players.findIndex(player => player.id === gameResult.highestHand.id)
                    this.players[winnerIndex].winner = true
                    this.message = rank.message
                }
            } else {
                const winningHand = await this.sortHandsByRank.shift(),
                arrayId = await this.handArrayIndex(winningHand),
                rank = await this.winningHandMessage(winningHand)
                this.players[arrayId].handValue = rank
                const winnerIndex = this.players.findIndex(player => player.id === winningHand.id)
                this.players[winnerIndex].winner = true
                this.message = rank.message
            }
        },
    },
    getters: {
        remainingCardsCount: state => {
            return state.deck.length
        },
        randomCardIndex() {
            return Math.floor(Math.random() * this.remainingCardsCount)
        },
        getCard: state => index => {
            return state.deck[index]
        },
        sortHandsByRank: state => {
            return [...state.players].sort(( firstPlayer, secondPlayer ) => firstPlayer.handValue.value - secondPlayer.handValue.value )
        },
        matchingHighHands() {
            let sortedPlayersHands = this.sortHandsByRank,
            firstHighestHand = sortedPlayersHands[0].handValue.value
            return sortedPlayersHands.filter(player => player.handValue.value === firstHighestHand)
        },
        winningHandMessage: () => (hand) => {
            let message = '';
            switch(hand.handValue.type){
                case "Royal Flush":
                case "Flush":
                case "four of a kind":
                    message = 'a'
                break
                case "Full House":
                    message = `a ${hand.handValue.highCard.trips.highCard.value} high`
                    break
                //ToDo: Needs three of a kind
                case "two pairs": //ToDo: needs improving on the wording
                    // console.log('Reached two pairs message set', hand.handValue.highCard)
                    switch(hand.handValue.highCard[0].value){ // this could be a text formatting helper partial
                        case 14:
                            message = 'Ace high,'
                            break
                        case 13:
                            message = 'King high,'
                            break
                        case 12:
                            message = 'Queen high,'
                            break
                        case 11:
                            message = 'Jack high,'
                            break
                        default:
                            message = `${hand.handValue.highCard[0].card.replace(/\D/g,'')} high,`
                    }
                    break
                default:
                    console.log("default message, card:", hand.handValue.highCard.card, hand.handValue.highCard)
                    switch(hand.handValue.highCard.value){ // this could be a text formatting helper partial
                        case 14:
                            message = 'Ace high'
                            break
                        case 13:
                            message = 'King high'
                            break
                        case 12:
                            message = 'Queen high'
                            break
                        case 11:
                            message = 'Jack high'
                            break
                        default:
                            message = `${hand.handValue.highCard.card.replace(/\D/g,'')} high`
                    }
            }
            if (hand.handValue.kicker) {
                message = `a ${hand.handValue.kicker.card.slice(1)} high kicker,`
            }
            return { ...hand.handValue,
                message: `${textFormatting.ucFirst(hand.name)} wins with ${hand.handValue.type === 'pair' || hand.handValue.type === 'two pairs' ? 'a' : ''} ${message} ${hand.handValue.type}.`,
            }
        },
        splitPotMessage: () => (splitPotHands) => {
            let names = [...splitPotHands].map(hand => textFormatting.ucFirst(hand.name)).join(", "),
            firstHighCard = [...splitPotHands].shift(),
            highCard = firstHighCard.handValue.highCard,
            highCardMessage = highCard.value // I dont like the name of this variable

            if (highCard.value > 9) { // this could be a text formatting helper partial
                switch(highCard.value){
                    case 14:
                        highCardMessage = 'Ace high'
                        break
                    case 13:
                        highCardMessage = 'King high'
                        break
                    case 12:
                        highCardMessage = 'Queen high'
                        break
                    case 11:
                        highCardMessage = 'Jack high'
                        break
                }
            }
            if ([...splitPotHands].length === 2) {
                names = names.replaceAll(", ", " & ")
            }
            names = names.slice(0, names.length);
            if (firstHighCard.handValue.type === "two pairs") {
                highCardMessage = `${firstHighCard.handValue.highCard[0].card.splice(1)}`
            }
            if (firstHighCard.handValue.type === "Full House") {
                highCardMessage = `${firstHighCard.handValue.highCard.trips.highCard.card.splice(1)}`
            }
            return `Split pot for players ${names} with a ${firstHighCard.handValue.type.toLowerCase()}, ${highCardMessage}.`
        },
        handArrayIndex: (state) => (hand) => {
            return state.players.findIndex(player => player.id === hand.id)
        }
    },
})