var sparkline = require('../site/sparkline.js');
var assert = require('assert');
var table = require('../site/table.js')
var mockData = require('../test/mockData.js')



var jsdom = require('jsdom')
const { JSDOM } = jsdom;
var fs = require('fs');
var indexHTML = fs.readFileSync('./site/index.html','utf8');
const dom = new JSDOM(indexHTML);
global.window = dom.window;
global.document = dom.window.document;



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

  describe('#endToEndTest()', function() {
      it('Here we add three new rows and one update', function() {
          table.init("#data");
          table.update(mockData.testMessage);
          table.update(mockData.testMessage2);
          table.update(mockData.testMessage3);
          table.update(mockData.testMessage3);
          var rows = document.getElementById("data").rows.length;
         assert.equal(4,rows); //4 rows because the HEADER is a ROW also.
      });
    });
});