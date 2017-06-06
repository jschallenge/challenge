
// configure visible fields
//Full data structure
//Html table will be sync with this structure
var dataStruct = {};

//htmlTable
var htmlTable = null;

const showFields = ["name", "bestBid", "bestAsk", "lastChangeAsk", "lastChangeBid"];
const titles = {"name":"Name", "bestBid": "Best Bid", "bestAsk": "Best Ask", "lastChangeAsk": "Last Change Ask", "lastChangeBid": "Last Change Bid &#9651;"};
const expireMidprice = 30000;


var midprice = {};


//draw sparkline and add to table
function addMidpriceSparkline (key, row, index) {
  var cell = row.cells[index]
  if (!cell)
    cell = row.insertCell(-1)
  else
  cleanCell (cell)

   if (typeof Sparkline != "undefined") { //Just for testing pourpouse and not compatible browsers
        const sparkElement = document.createElement('span');
        const sparkline = new Sparkline(sparkElement);
        cell.appendChild (sparkElement);
        var onlyPrices = [];
          midprice[key].forEach(function(item) {
            onlyPrices.push ( item[1] )
          });

          sparkline.draw(onlyPrices)
  }
  else cell.appendChild ( document.createTextNode('N/A') );

}


function updateOrCreateRow(  message ) {

  //iterate overy keys and create rows using that order
    var key = message["name"]
    var body = htmlTable.tBodies[0]
    var row;
    var rowArr = body.getElementsByClassName(key);
    var create = false;
    if ( rowArr.length === 0 )   {
      create = true;
      //add new row to last position
      row = htmlTable.tBodies[0].insertRow(-1)
      row.id = key
      row.className = key
    }
    else
      row = rowArr[0]

    //add cells with currency values
    var count = 0;
    for (var keyColumn in message) {
      //show only enabled fields
      if (message.hasOwnProperty(keyColumn)  && showFields.indexOf(keyColumn) > -1) {
        var cell;
        if ( create )
          cell = row.insertCell(-1)
        else {
          cell = row.cells[count];
          }
        cell.innerHTML = message[keyColumn]
        count++;
      }
    }


    addMidpriceSparkline (key, row, count);
}


/**
* Here we sort the data and return an array of the ordered keys. We use a lambda function.
*/
function sortData( data ) {
   var orderedKeys = Object.keys(data);
   orderedKeys.sort( (a,b) => data[a]["lastChangeBid"] - data[b]["lastChangeBid"]);
   return orderedKeys;
}


/**
* First we order the data. Once ordered, we repaint the table applying the minimum changes.
*/
function sortTable( ) {
  //sort keys in a new array using data struct
  var orderedKeys = sortData(dataStruct);

  var body = htmlTable.tBodies[0];
  var count = 0;
  orderedKeys.forEach(function(key) {
    var row = body.getElementsByClassName(key)[0];

    //If row must change its position (index-1 to avoid header)
    var index = row.rowIndex - 1;

    if( index != count) {
      var currentDataRow = dataStruct[key];
      var oldId = row.id;
      var oldClassName = row.className;
      var oldHtml = row.innerHTML;
      var span = row.getElementsByTagName("span")[0];

      htmlTable.tBodies[0].deleteRow(index);

      //add new row to current position
      var newrow = htmlTable.tBodies[0].insertRow(count);
      newrow.id = oldId;
      newrow.className = oldClassName;
      newrow.innerHTML = oldHtml;
      cleanCell( newrow.cells[newrow.cells.length-1] );
      newrow.cells[newrow.cells.length-1].appendChild (span);
    }
    count++;
  });
}



//Update midprice
function calculateMidprice (midprice, message ) {
  //calculate midprice
  var elemMidprice = (message["bestBid"] + message["bestAsk"]) / 2;
  var currentTimestamp = Date.now()
  //check if exist previous midPrices
  if ( midprice[message["name"]] )
    cleanOldMidprices (midprice[message["name"]], currentTimestamp)
  else
    midprice[message["name"]] = []
  //Add new midprice
  midprice[message["name"]].push( [currentTimestamp, elemMidprice] )
}



//Util function to maintain only fresh bids
function cleanOldMidprices ( midPriceArray, currentTimestamp) {
  var lengthPrices = midPriceArray.length - 1
  //Iterate midprice array and remove elements older than 30 seconds
  for(var index=lengthPrices-1; index>=0; index--)
  {
    if ( currentTimestamp - midPriceArray[index][0] > expireMidprice )
      midPriceArray.splice (index, 1)
  }
}

function cleanCell (cell) {
  while (cell.hasChildNodes())
    cell.removeChild(cell.lastChild);
}

function init(selector ) {
  htmlTable = document.querySelector(selector);
}

function update ( message ) {
//Update data structure with last message
   dataStruct[message["name"]] = message;

   calculateMidprice(midprice, message);
   updateOrCreateRow ( message );
   sortTable();
}

module.exports = {
    init:init,
    update:update,
    calculateMidprice:calculateMidprice,
    sortData:sortData
};