export let helpers = {
    // This is not being used
    checkNonPairHandEquality(orderedCards, pairIndex = 0){
        let highestNonPairKickerHand = orderedCards[0].handValue.nonPairs[pairIndex].value;
        return [...orderedCards].filter(hand => highestNonPairKickerHand === hand.handValue.nonPairs[pairIndex].value);
    },

    pairsCheck(cards){
        let pairs = cards.map(card => {
            let cardValue = card.slice(1)
            return cards.map(key => {
                const compareKeyValue = key.slice(1)
                if(key !== card && compareKeyValue === cardValue){
                    return key
                }
            })
        })
        .map(arr => arr.filter(item => item!== undefined))
        .filter(arr => arr.length)
        .map(arr => arr[0])
        //  console.log({pairs})
        return pairs
    },
    // Not returning pairs for kings here.
    // pairsCheck(cards){
    //     let pairs = [];
    //     cards.forEach((card, index) => {
    //         let cardValue = card.slice(1);
    //         cards.splice(index, 1); //remove the card being searched
    //         cards.forEach((key) => {
    //             if(key !== card && key.slice(1) === cardValue){
    //                 pairs.push(key);
    //                 cards = cards.filter(item => item[1] !== cardValue); //remove any card with cardValue
    //             }
    //         });
    //     });
    //     console.log({ pairs})
    //     return pairs;
    // },
    getCardsValues(cardsArr) {
        let cardItemsWithValues = [];
        cardsArr.forEach(card => {
            let cardValue = card[1];
            if(cardValue === "1"){ //check for 10 which is the exception because it has 2 characters for its value
                cardItemsWithValues.push({
                    value: 10,
                    card
                })
            } else if(isNaN(cardValue) ) {
                switch(cardValue){ // change the JQKA to be numbers to sort against more easily
                    case "J":
                        cardItemsWithValues.push({
                            value: 11,
                            card
                        })
                    break;
                    case "Q":
                        cardItemsWithValues.push({
                            value: 12,
                            card
                        })
                    break;
                    case "K":
                        cardItemsWithValues.push({
                            value: 13,
                            card
                        })
                    break;
                    case "A":
                        cardItemsWithValues.push({
                            value: 14,
                            card
                        })
                    break;
                }
            } else {
                cardItemsWithValues.push({
                    value: parseInt(cardValue),
                    card
                })
            } 
        });
        return cardItemsWithValues;
    },
    // helper for 4 and 3 of a kind and flushes
    getCardMatches(cardsArr, index){
        let cardValue = cardsArr.splice(0, 1)[0],
        matches = [cardValue, ]; //first item is always a match

        cardsArr.forEach(card => {
            //console.log(card, cardValue);
            if(card[index] === cardValue[index]){
                matches.push(card);
            }
        })
        return matches;
    },
    sortCardsByValues(cards, dir = 'asc'){
        if(dir === 'asc'){
            return this.getCardsValues(cards).sort((first, second) => first.value - second.value);
        } else {
            return this.getCardsValues(cards).sort((first, second) =>  second.value - first.value);
        }
    }
}