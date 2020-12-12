function createPlayer(name) {
  return {
    id: Math.floor(Math.random() * 1000000000),
    name: name,
    order: 0,
    giftID: -1,
    giftDesc: '',
    selected: false,
    stealInitiatorCount: 0,
    stolenFromCount: 0,
    timeSpentMilliseconds: 0,
    timeSpentFormatted: '',
  }
}

function createGift(giver, videoName, description, url) {
  return {
    id: Math.floor(Math.random() * 1000000000),
    opened: false,
    number: 0,
    color: '',
    giver: giver,
    recipient: '',
    videoName: videoName,
    description: description,
    url: url,
    stolenCount: 0,
  }
}

export const config = {
  firstPlayerEndSwap: true,
  firstPlayerEndSwapStrict: false,
  players: [
    createPlayer("Steve"),
    createPlayer("Alice"),
    createPlayer("Mark"),
    createPlayer("Megan"),
  ],
  gifts: [
    createGift("Steve & Alice", "eatchild", "Eat child book", 'https://www.amazon.com/Id-Really-Like-Eat-Child/dp/0307930084 Eat child book'),
    createGift("Steve & Alice", "tubeguy", "Tube Guy", 'https://www.amazon.com/dp/0762462876/ref=cm_sw_r_oth_api_fabc_xwsVFbNZQG4XN Tube guy'),
    createGift("Mark & Megan", "bluetooth", "Bluetooth hat", 'https://www.amazon.com/dp/B0163N2T38/ref=cm_sw_r_oth_api_fabc_4kTUFb86557J4 Bluetooth hat'),
    createGift("Mark & Megan", "pizza", "Pizza pocket", 'https://www.amazon.com/dp/B07J38FBP9/ref=cm_sw_r_oth_api_fabc_WLtVFbZ3Z2V5C Pizza pocket'),
  ],
};
