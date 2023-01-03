import {helpers} from "./pokerHandHelpers";

export default class HandChecks {
    highCard(){
        return this.rank = {value: 9, type: "high card",  highCard: helpers.sortCardsByValues([...this.playersCards]).pop(), };
    }
    singlePair(){
        console.log('singlePair check')
        let pairs = helpers.pairsCheck([...this.playersCards])
        if (pairs.length === 2) {
            return this.rank = {value: 8, type: "pair", highCard: helpers.getCardsValues(pairs).pop(), }
        }
        return false
    }
    twoPair(){
        console.log('twoPair check')
        let pairs = helpers.pairsCheck([...this.playersCards]);
        if(pairs.length === 4){
            return this.rank = {value: 7, type: "two pairs", highCard: helpers.sortCardsByValues(pairs, 'desc')};
        }
        return false;
    }
    tripsCheck(){
        let cards = [...this.playersCards],
        firstRes = helpers.getCardMatches(cards, 1); // first card gets spliced which mutates the cards array and is used for other checks
        if (firstRes.length < 3){
            let secondRes = helpers.getCardMatches(cards, 1); //if firstRes.length < 4, run check again with the shortened array
            if(secondRes.length < 3){
                let thirdRes = helpers.getCardMatches(cards, 1); //if firstRes.length < 4, run check again with the shortened array
                if(thirdRes.length < 3){
                    return false;
                } else {
                    return this.rank = {value: 6, type: "three of a kind", highCard: helpers.sortCardsByValues(thirdRes, 'desc').pop(), };
                }
            } else {
                return this.rank = {value: 6, type: "three of a kind", highCard: helpers.sortCardsByValues(secondRes, 'desc').pop(), };
            }
        } else {
            return this.rank = {value: 6, type: "three of a kind", highCard: helpers.sortCardsByValues(firstRes, 'desc').pop(), };
        }
    }
    straightCheck(){
        let cards = [...this.playersCards],
        heirarchyOfCards = [],
        itemsSorted = helpers.sortCardsByValues(cards), //order the cards 
        firstSortedItem = itemsSorted[0],
        firstSortedItemValue = firstSortedItem.value;

        for(let i = 2; i <= 14; i++){
            heirarchyOfCards.push(i);
        }

        let aceLowStraightRef = [...heirarchyOfCards].splice(0, 4);
        aceLowStraightRef.push( heirarchyOfCards[heirarchyOfCards.length - 1]);
        let isAceLowStraight = itemsSorted.filter((item, index) => item.value === aceLowStraightRef[index]).length === 5;
        if(isAceLowStraight) {  // checkForAceBottomStraight
            return this.rank = {value: 5, type: "Straight", highCard: helpers.sortCardsByValues(cards, 'dec')[0], };
        } else if(firstSortedItemValue < 11 ) {   //else if check firstSortedItemValue < 11
            let firstOrderedCard = heirarchyOfCards.find(card => card === firstSortedItemValue),
            firstOrderedCardIndex = heirarchyOfCards.indexOf(firstOrderedCard),
            splicedHeirarchyOfCardsFromFirstCardIndex = [...heirarchyOfCards].splice(firstOrderedCardIndex, 5),
            isAStraight = itemsSorted.filter((item, index) => item.value === splicedHeirarchyOfCardsFromFirstCardIndex[index]).length === 5;
            if(isAStraight){
                return this.rank = {value: 5, type: "Straight", highCard: helpers.sortCardsByValues(cards, 'dec')[0], };
            } else {
                return false
            }
        } 
        else {
            return false
        }
    }
    flushCheck(){
        let cards = [...this.playersCards];
        if(helpers.getCardMatches([...cards], 0).length === 5){
            return this.rank = {value: 4, type: "Flush", highCard: helpers.sortCardsByValues(cards).pop()};
        } 
        return false;
    }
    bookCheck(){
        let hasTrips = this.tripsCheck();
        if(hasTrips){ 
            let tripsValue = hasTrips.highCard.value; //remove items in the hand which match the trips value
            let filteredTripsOut = [...this.playersCards].filter(card => parseInt(card.slice(1)) !== tripsValue);
            if(filteredTripsOut[0][1] === filteredTripsOut[1][1]){  // check the remaining cards are matching
                return this.rank = { value: 3, type: "Full House", highCard: { trips: hasTrips, pair: helpers.getCardsValues([filteredTripsOut[0]])[0],}, }; 
            }
        }
        return false;
    }
    quadsCheck(){
        let cards = [...this.playersCards],
        firstRes = helpers.getCardMatches(cards, 1);
        if (firstRes.length < 4){
            let secondRes = helpers.getCardMatches(cards, 1); //if firstRes.length < 4, run check again with the shortened array
            if(secondRes.length < 4){
                return false;
            } else {
                return this.rank = {value: 2, type: "four of a kind", highCard: helpers.sortCardsByValues(secondRes, 'desc').shift()};
            }
        } else {
            return this.rank = {value: 2, type: "four of a kind", highCard: helpers.sortCardsByValues(firstRes, 'desc').shift()};
        }
    }
    straightFlushCheck(){
        let straightCheck = this.straightCheck(this.playersCards);
        if (straightCheck && this.flushCheck(this.playersCards)){
            return this.rank = {value: 1, type: "Straight Flush", highCard: helpers.sortCardsByValues(this.playersCards, 'desc').shift() };
        }
    }
    royalFlushCheck(){
        let firstCardsValue = helpers.sortCardsByValues([...this.playersCards])[0].value;
        if (firstCardsValue === 10 && this.straightCheck(this.playersCards) && this.flushCheck(this.playersCards)){
            return this.rank = {value: 0, type: "Royal Flush", highCard: { card: "Royal Flush" } };
        }
    }
}