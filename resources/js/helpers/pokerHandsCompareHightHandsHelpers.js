import {helpers} from './pokerHandHelpers.js';

export default class compareHighHandsHelpers {
    compareFullHouseCards(){
        const threeOfAKindHands = [...this.playersHighHands].sort((playerA, playerB) => playerB.handValue.highCard.trips.value - playerA.handValue.highCard.trips.value).reverse()
        console.log('reached threeOfAKindHands', {threeOfAKindHands})
        this.highestHand = threeOfAKindHands[0]
        this.highestHand.arrayIndex = this.getWinningHandIndex()
    }
    compareTwoPairHighCards() {
        let playersHighPairValuesSorted = [...this.playersHighHands].sort((playerA, playerB) => playerB.handValue.highCard[0].value - playerA.handValue.highCard[0].value);
        //if there are no mathching high cards from players return the high hand
        if (playersHighPairValuesSorted[0].handValue.highCard[0].value === playersHighPairValuesSorted[1].handValue.highCard[0].value) {
            //filter hands by top high card and sort by value
            let playersSecondPairValuesFilteredAndSorted = [...playersHighPairValuesSorted]
                .filter(highHand => highHand.handValue.highCard[0].value === playersHighPairValuesSorted[0].handValue.highCard[0].value)
                .sort((playerA, playerB) => playerB.handValue.highCard[1].value - playerA.handValue.highCard[1].value);
            if (playersSecondPairValuesFilteredAndSorted[0].handValue.highCard[1].value === playersSecondPairValuesFilteredAndSorted[1].handValue.highCard[1].value) { //if second players have same second hand  
                let matchingSecondCardHands = [...playersSecondPairValuesFilteredAndSorted]
                .filter(highHand => highHand.handValue.highCard[1].value === playersSecondPairValuesFilteredAndSorted[0].handValue.highCard[1].value);
                //check for non pair hands //remove pairs to compare kicker cards
                let nonPairHandsSortedByValue = [...matchingSecondCardHands].map(secondCardHand=>{
                    let pairs = [];
                    pairs.push(secondCardHand.handValue.highCard[0].card.slice(1));
                    pairs.push(secondCardHand.handValue.highCard[1].card.slice(1));

                    let nonPairs = [...secondCardHand.hand].filter((card) => !pairs.includes(card.slice(1)));
                    secondCardHand.handValue.nonPairs = helpers.sortCardsByValues(nonPairs);
                    return secondCardHand;
                }).sort((playerA, playerB) => playerB.handValue.nonPairs[0].value - playerA.handValue.nonPairs[0].value);

                if(nonPairHandsSortedByValue[0].handValue.nonPairs[0].value > nonPairHandsSortedByValue[1].handValue.nonPairs[0].value){
                    this.highestHand = nonPairHandsSortedByValue[0];
                    this.highestHand.handValue.kicker = nonPairHandsSortedByValue[0].handValue.nonPairs[0];
                    this.highestHand.arrayIndex = this.getWinningHandIndex();
                } else {
                    let highestNonPairKickerHand = nonPairHandsSortedByValue[0].handValue.nonPairs[0].value,
                    highNonPairKickerHands = [...nonPairHandsSortedByValue].filter(hand => highestNonPairKickerHand === hand.handValue.nonPairs[0].value);
                    //need to set split pot hands to the cards with high non pairs
                    this.splitPotHands = [...highNonPairKickerHands];
                }
            } else {
                this.highestHand = playersSecondPairValuesFilteredAndSorted[0];
                this.highestHand.handValue.kicker = playersSecondPairValuesFilteredAndSorted[0].handValue.highCard[1]; //return the hand with the high second card as kicker value
                this.highestHand.arrayIndex = this.getWinningHandIndex();
            }
        } else {
            this.highestHand = playersHighPairValuesSorted.shift();
            this.highestHand.arrayIndex = this.getWinningHandIndex();
        }
    }
    // This is creating a bug
    comparePairHighCards(){

        console.log([...this.playersHighHands])
        let playersHighCardValuesSorted = [...this.playersHighHands].sort((playerA, playerB) => playerB.handValue.highCard.value - playerA.handValue.highCard.value);
        
        // console.log({playersHighCardValuesSorted})
        if (playersHighCardValuesSorted[0].handValue.highCard.value === playersHighCardValuesSorted[1].handValue.highCard.value) {
            let highCardHandsFiltered = [...playersHighCardValuesSorted].filter(highHand => highHand.handValue.highCard.value === playersHighCardValuesSorted[0].handValue.highCard.value);
            
            let nonPairHandsSortedByValue = [...highCardHandsFiltered].map(highCardHand => { //remove pairs to compare kicker cards
                let pair = highCardHand.handValue.highCard.card.slice(1),
                nonPairs = [...highCardHand.hand].filter(card => !pair.includes(card.slice(1)) );
                highCardHand.handValue.nonPairs = helpers.sortCardsByValues(nonPairs, 'desc');
                return highCardHand;
            }).sort((playerA, playerB) => playerB.handValue.nonPairs[0].value - playerA.handValue.nonPairs[0].value);
  
            //check highest nonPair hands from the 2 hands, there can not be more than 2 pairs of any card
            if(nonPairHandsSortedByValue[0].handValue.nonPairs[0].value === nonPairHandsSortedByValue[1].handValue.nonPairs[0].value){
                let handsSortedBySecondNonPair = [...nonPairHandsSortedByValue].sort((playerA, playerB) => playerB.handValue.nonPairs[1].value - playerA.handValue.nonPairs[1].value)
                if(handsSortedBySecondNonPair[0].handValue.nonPairs[1].value === handsSortedBySecondNonPair[1].handValue.nonPairs[1].value){
                    let handsSortedByThirdNonPair = [...handsSortedBySecondNonPair].sort((playerA, playerB) => playerB.handValue.nonPairs[2].value - playerA.handValue.nonPairs[2].value)
                    if(handsSortedByThirdNonPair[0].handValue.nonPairs[2].value === handsSortedByThirdNonPair[1].handValue.nonPairs[2].value){
                        this.splitPotHands = [...handsSortedByThirdNonPair];
                    } else {
                        this.setWinningKickerHand(2, handsSortedByThirdNonPair, "Third")
                    }
                } else {
                    this.setWinningKickerHand(1, handsSortedBySecondNonPair, "Second")
                }
            } else {
                this.setWinningKickerHand(0, nonPairHandsSortedByValue, "First")
            }
        } else { //if there are no matching high cards from the two players hands, return the first high hand
            this.highestHand = playersHighCardValuesSorted[0];
            this.highestHand.arrayIndex = this.getWinningHandIndex();
        }
    }
    compareCards(){
        let playersFirstHighCardsSorted = [...this.playersHighHands]
        .map(playersHand => {
            playersHand.handValue = {
                ...playersHand.handValue,
                nonPairs: helpers.sortCardsByValues(playersHand.hand, 'desc'),
            }
            return playersHand;
        })
        .sort((playerA, playerB) => playerB.handValue.nonPairs[0].value - playerA.handValue.nonPairs[0].value)
        //if the first sorted hands first non pair = the second hands first non pair
        if (playersFirstHighCardsSorted[0].handValue.nonPairs[0].value === playersFirstHighCardsSorted[1].handValue.nonPairs[0].value) {
            // ADD filter by first card and sort by 2nd non pair
            let filteredByFirstCardOrderedBySecond = this.filterByCardIndexOrderByCardIndex(playersFirstHighCardsSorted, 0, 1);
            // console.log({filteredByFirstCardOrderedBySecond})
            //if the first sorted hands second non pair = the second hands second non pair
            if (filteredByFirstCardOrderedBySecond[0].handValue.nonPairs[1].value === filteredByFirstCardOrderedBySecond[1].handValue.nonPairs[1].value) {
            // ADD filter by second card and sort by 3nd non pair
                let filteredBySecondCardOrderedByThird = this.filterByCardIndexOrderByCardIndex(filteredByFirstCardOrderedBySecond, 1, 2);
                // console.log({filteredBySecondCardOrderedByThird})
                //if the first sorted hands secothirdnd non pair = the second hands third non pair
                if (filteredBySecondCardOrderedByThird[0].handValue.nonPairs[2].value === filteredBySecondCardOrderedByThird[1].handValue.nonPairs[2].value) {
            // ADD filter by third card and sort by 4th non pair
                    let filteredByThirdCardOrderedByFourth = this.filterByCardIndexOrderByCardIndex(filteredBySecondCardOrderedByThird, 2, 3);
                    // console.log({filteredByThirdCardOrderedByFourth})
            //         //if the first sorted hands fourth non pair = the second hands third non pair
                        if (filteredByThirdCardOrderedByFourth[0].handValue.nonPairs[3].value === filteredByThirdCardOrderedByFourth[1].handValue.nonPairs[3].value) {
                        // ADD filter by fourth card and sort by 5th non pair
                        let filteredByFourthCardOrderedByFifth = this.filterByCardIndexOrderByCardIndex(filteredByThirdCardOrderedByFourth, 3, 4);
                        // console.log({filteredByFourthCardOrderedByFifth})
            //                 //if the first sorted hands fifth non pair = the second hands fifth non pair
                        if (filteredByFourthCardOrderedByFifth[0].handValue.nonPairs[4].value === filteredByFourthCardOrderedByFifth[1].handValue.nonPairs[4].value) {
                            //set split pot for filtered cards
                            this.splitPotHands = filteredByFourthCardOrderedByFifth;
                        } else {
                            this.setWinningKickerHand(4, filteredByFourthCardOrderedByFifth, "Fifth");
                        }
                    } else {
                        this.setWinningKickerHand(3, filteredByThirdCardOrderedByFourth, "Fourth");
                    }
                } else {
                    this.setWinningKickerHand(2, filteredBySecondCardOrderedByThird, "Third");
                }
            } else {
                this.setWinningKickerHand(1, filteredByFirstCardOrderedBySecond, "Second");
            }
        } else {
            this.setWinningKickerHand(0, playersFirstHighCardsSorted, "First");
        }
    }
    filterByCardIndexOrderByCardIndex(playersCards, filterIndex, sortIndex){
        return playersCards
        .filter(cards => cards.handValue.nonPairs[filterIndex].value === playersCards[0].handValue.nonPairs[filterIndex].value)
        .sort((playerA, playerB) => playerB.handValue.nonPairs[sortIndex].value - playerA.handValue.nonPairs[sortIndex].value)
    }
    compareHighCards() {
        let playersHighCardValuesSorted = [...this.playersHighHands].sort((playerA, playerB) => playerB.handValue.highCard.value - playerA.handValue.highCard.value);
        if (playersHighCardValuesSorted[0].handValue.highCard.value === playersHighCardValuesSorted[1].handValue.highCard.value) {
            let highCardHandsFiltered = [...playersHighCardValuesSorted].filter(highHand => highHand.handValue.highCard.value === playersHighCardValuesSorted[0].handValue.highCard.value);
            this.splitPotHands = highCardHandsFiltered;
        } else {         //if there are no matching high cards from players return the high hand
            this.highestHand = playersHighCardValuesSorted[0];
            this.highestHand.arrayIndex = this.getWinningHandIndex();
        }
    }
    setWinningKickerHand(nonPairCardId = 0, sortedCards, nthLabel = "First"){
        console.log(`${nthLabel} non pair check`, {first: sortedCards[0].handValue.nonPairs[nonPairCardId].value, second: sortedCards[1].handValue.nonPairs[nonPairCardId].value , card: sortedCards[0].handValue.nonPairs[nonPairCardId].card})
        this.highestHand = sortedCards[0];
        this.highestHand.handValue.kicker = {
            card : sortedCards[0].handValue.nonPairs[nonPairCardId].card,
        };
        this.highestHand.arrayIndex = this.getWinningHandIndex();
    }
}
