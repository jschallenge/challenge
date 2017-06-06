var testMessage = {
  "name": "usdjpy",
  "bestBid": 106.7297012204255,
  "bestAsk": 107.25199883791178,
  "openBid": 107.22827132623534,
  "openAsk": 109.78172867376465,
  "lastChangeAsk": -4.862314256927661,
  "lastChangeBid": -2.8769211401569663
}
var midPrice=106.99085002916864

var dataToSort = {
  "sample1":{"lastChangeBid": 0},
  "sample2":{"lastChangeBid": -4},
  "sample3":{"lastChangeBid": 2},
  "sample4":{"lastChangeBid": 9},
  "sample5":{"lastChangeBid": 4},
  "sample6":{"lastChangeBid": 13}
};

module.exports = {
    dataToSort:dataToSort,
    testMessage:testMessage,
    expectedMidPrice: midPrice
};