import Vue from "vue"
import Vuex from 'vuex'
import {deckOfCards, getHandValue, compareHighHands, animals, adjectives} from "../service/PokerHands"
import textFormatting from "../helpers/textFormatting"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        deck: [...deckOfCards],
        players: [
            // Bug with Full house FIXED NOW
            // {"id":123321,"name":"white","hand":["D6","C8","D4","C4","D8"]},
            // {"id":987789,"name":"black","hand":["D3","H4","DA","C7","HJ"]},
            // {"id":678876,"name":"red","hand":["HK","CK","C2","S4","DK"]},
            // {"id":3867,"name":"Testies","hand":["DJ","S6","C5","CJ","D2"]}
        ],
        message: null,
    },
    mutations: {
        REMOVE_CARD(state, cardIndex){
            state.deck.splice(cardIndex, 1);
        },
        SET_PLAYERS(state, players){
            state.players = players
        },
        SET_SINGLE_PLAYER(state, player) {
            state.players.push(player)
        },
        SET_PLAYERS_CARD(state, {arrayId, card}){
            state.players[arrayId].hand.push(card);
        },
        SET_HAND_VALUE(state, {arrayId, rank}){
            state.players[arrayId].handValue = rank;
        },
        SET_WINNING_HAND(state, {playerId, message}){
            let winnerIndex = state.players.findIndex(player => player.id === playerId);
            state.players[winnerIndex].winner = true;
            state.message = message;
            // state.message = state.players[winnerIndex].handValue.message; // this is not working
        },
        SET_SPLIT_POT_HANDS(state, {playerIds, message}){
            state.message = message;
            playerIds.forEach(playerId=>{
                state.players.forEach((player, index) => {
                    if(player.id === playerId){
                        state.players[index].splitPotWinner = true;
                    }
                })
            });
        },
        SET_CARDS(state){
            state.deck = [...deckOfCards];
        },
        SET_HANDS(state){
            state.players = state.players.map(player => {
                player.hand = [];
                return player;
            });
        },
        SET_MESSAGE(state){
            state.message = null
        },
    },
    actions: {
        resetGame({commit}){
            commit("SET_CARDS");
            commit("SET_HANDS");
            commit("SET_MESSAGE");
        },
        addPlayers({commit}, {players}){
            // Re-instate this after adding the feature for the user to add apponents (up to 5)
            // let players = playersItems.players;
            // players.push({
            //     id: 123,
            //     name: "Foo",
            //     hand:[],
            // });
            // for(let i = 0; i < 2; i++){
            //     players.push(
            //         {
            //             id: Math.floor(Math.random() * 1000),
            //             name: `${textFormatting.ucFirst(adjectives[Math.floor(Math.random() * adjectives.length)])} ${animals[Math.floor(Math.random() * animals.length)]}`,
            //             hand:[],
            //         }
            //     );
            // }
            commit("SET_PLAYERS", players);
        },
        addSinglePlayer({commit}, playersName){
            const player = {
                id: Math.floor(Math.random() * 100000),
                name: playersName,
                hand:[],
            }
            commit("SET_SINGLE_PLAYER", player);
        },
        dealCards({ state, commit, getters }){
            let i = 0
            while(i < 5){
                for(let j = 0; j < state.players.length; j++) {
                    let cardIndex = getters.randomCardIndex,
                    card = getters.getCard(cardIndex)
                    commit("REMOVE_CARD", cardIndex)
                    commit("SET_PLAYERS_CARD", {arrayId: j, card})
                }
                i++
            }
        },
        async winningHand({state, commit, getters}){
            state.players.forEach((player, arrayId)=>{
                let rank = new getHandValue(player.hand).rank;
                commit('SET_HAND_VALUE', {rank, arrayId});
            });
            let matchingHighHands = await getters.matchingHighHands;
            console.log({matchingHighHands})
            if (matchingHighHands.length > 1 ) { //use service to loop through the matching high hands
                let gameResult = new compareHighHands(matchingHighHands);
                  console.log("matchingHighHands.length > 1, Matching high hands check", {gameResult})
                if (gameResult.splitPotHands.length) {
                    let message = getters.splitPotMessage(gameResult.splitPotHands),
                    playerIds = gameResult.splitPotHands.map(hand => hand.id)
                    commit('SET_SPLIT_POT_HANDS', {message, playerIds})
                } else {
                    console.log({highestHand__: gameResult.highestHand})
                    let rank = await getters.winningHandMessage(gameResult.highestHand)
                    // ToDo: Should remove the arrayIndex set in the PokerHands Service and use the getter handArrayIndex instead...
                    commit('SET_HAND_VALUE', {rank, arrayId: gameResult.highestHand.arrayIndex})
                    commit('SET_WINNING_HAND', { playerId : gameResult.highestHand.id, message: rank.message })
                }
            } else {
                let winningHand = await getters.sortHandsByRank.shift(),
                arrayId = await getters.handArrayIndex(winningHand),
                rank = await getters.winningHandMessage(winningHand)
                console.log("No matching hands", {winningHand})
                commit('SET_HAND_VALUE', {rank, arrayId})
                commit('SET_WINNING_HAND', { playerId : winningHand.id, message: rank.message })
            }
        },
    },
    getters: {
        remainingCardsCount: state => {
            return state.deck.length
        },
        randomCardIndex: (state, getters) => {
            return Math.floor(Math.random() * getters.remainingCardsCount)
        },
        getCard: state => index => {
            return state.deck[index]
        },
        sortHandsByRank: state => {
            return [...state.players].sort(( firstPlayer, secondPlayer ) => firstPlayer.handValue.value - secondPlayer.handValue.value )
        },
        matchingHighHands: (state, getters) => {
            let sortedPlayersHands = getters.sortHandsByRank,
            firstHighestHand = sortedPlayersHands[0].handValue.value
            // console.log({sortedPlayersHands, firstHighestHand});
            return sortedPlayersHands.filter(player => player.handValue.value === firstHighestHand)
        },
        winningHandMessage: () => (hand) => {
            let message = '';
            switch(hand.handValue.type){
                case "Royal Flush":
                case "Flush":
                case "four of a kind":
                    message = 'a'
                break;
                case "Full House":
                    message = `a ${hand.handValue.highCard.trips.highCard.value} high`
                    break;
                case "two pairs": //ToDo: needs improving on the wording
                    console.log('Reached two pairs message set', hand.handValue.highCard)
                    switch(hand.handValue.highCard[0].value){
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
                    break;
                default:
                    console.log("default message, card:", hand.handValue.highCard.card, hand.handValue.highCard)
                    switch(hand.handValue.highCard.value){
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
            };
        },
        splitPotMessage: () => (splitPotHands) => {
            let names = [...splitPotHands].map(hand => textFormatting.ucFirst(hand.name)).join(", "),
            firstHighCard = [...splitPotHands].shift(),
            highCard = firstHighCard.handValue.highCard,
            highCardMessage = highCard.value // I dont like the name of this variable

            if (highCard.value > 9) {
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
            if([...splitPotHands].length === 2){
                names = names.replaceAll(", ", " & ")
            }
            names = names.slice(0, names.length);
            if(firstHighCard.handValue.type === "two pairs"){
                highCardMessage = `${firstHighCard.handValue.highCard[0].card.splice(1)}`
            }
            if(firstHighCard.handValue.type === "Full House"){
                highCardMessage = `${firstHighCard.handValue.highCard.trips.highCard.card.splice(1)}`
            }
            return `Split pot for players ${names} with a ${firstHighCard.handValue.type.toLowerCase()}, ${highCardMessage}.`
        },
        handArrayIndex: (state) => (hand) => {
            return state.players.findIndex(player => player.id === hand.id)
        }
    },
})