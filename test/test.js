var assert = require('assert');
var calculateMidprice = require('../site/midprice.js')
var mockData = require('../test/mockData.js')


describe('Challenge', function() {
  describe('#calculateMidprice()', function() {
    it('should calculate the mid price', function() {
        var midprice = {};
        calculateMidprice(midprice, mockData.testMessage)
        var elemMidprice = midprice[mockData.testMessage["name"]][0][1]        
        assert.equal(mockData.expectedMidPrice, elemMidprice);
        
    });
  });
});