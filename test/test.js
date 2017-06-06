var assert = require('assert');
var calculateMidprice = require('../site/midprice.js')

var midprice = {};
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


describe('Challenge', function() {
  describe('#calculateMidprice()', function() {
    it('should calculate the mid price', function() {
        
        calculateMidprice(midprice, testMessage)
        var elemMidprice = midprice[testMessage["name"]][0][1]        
         assert.equal(midPrice, elemMidprice);
        
    });
  });
});