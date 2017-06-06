var assert = require('assert');
var table = require('../site/table.js')
var mockData = require('../test/mockData.js')


describe('DB Challenge', function() {
  describe('#calculateMidprice()', function() {
    it('should calculate the mid price', function() {
        var midprice = {};
        table.calculateMidprice(midprice, mockData.testMessage)
        var elemMidprice = midprice[mockData.testMessage["name"]][0][1]        
        assert.equal(mockData.expectedMidPrice, elemMidprice);
        
    });
  });

  describe('#sortData()', function() {
      it('should sort the data by the lastChangeBid field ', function() {
          var orderedArray = table.sortData(mockData.dataToSort);
          console.log(orderedArray);
          //Expected result
          assert.deepEqual([ 'sample2', 'sample1', 'sample3', 'sample5', 'sample4', 'sample6' ], orderedArray);
      });
    });
});