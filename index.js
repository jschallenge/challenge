/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

// configure visible fields
const showFields = ["name", "bestBid", "bestAsk", "lastChangeAsk", "lastChangeBid"];
const midPriceTitle = "Mid Price";

const url = "ws://localhost:8011/stomp";
const expireMidprice = 30000;
  
//create Websockets client
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

//called when the client receives a STOMP message from the server
function receiveMsg (message) {
  //return new promise
  if (message.body) {
    //console.info("got message with body " + message.body)
    updateData (JSON.parse(message.body))
    refreshTable ()
  } else {
    console.info ("got empty message")
  }
}

var orderedKeys;
var data = {};
var midprice = {};
var dataTable = document.querySelector("#data");
var initialized = false;

//create headers
function initializeTable ( dataTable, message ) {
  initialized = true
  //var head = dataTable.createTHead()
  var row = dataTable.insertRow (-1)
  
  for (var key in message) {
    if (message.hasOwnProperty(key) && showFields.indexOf(key) > -1 ) {
      var cell = row.insertCell(-1)
      cell.innerHTML = key
    }
  }
  var cell = row.insertCell(-1)
  cell.innerHTML = midPriceTitle

}

function cleanOldMidprices ( midPriceArray, currentTimestamp) {
  var lengthPrices = midPriceArray.length - 1
  //Iterate midprice array and remove elements older than 30 seconds
  for(var index=lengthPrices-1; index>=0; index--)
  {
    if ( currentTimestamp - midPriceArray[index][0] > expireMidprice )
      midPriceArray.splice (index, 1)
  }
}

//update and sort data with last message
function updateData ( message ) {
  
  //first time, create inmutable headers
  if(!initialized)
    initializeTable(dataTable, message)
  
  //popule data map by currency key
  data[message["name"]] = message;
  
  //sort keys in a new array
  orderedKeys = Object.keys(data);
  orderedKeys.sort(function(a,b){return data[b]["lastChangeBid"] - data[a]["lastChangeBid"] });
  
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

function removeChildren ( table )
{
  var numRows = table.rows.length
  for(var x=numRows-1; x > 0; x--)
    table.deleteRow(x)
}

//draw sparkline and add to table
function addMidpriceSpakline (key, row) {
  var cell = row.insertCell(-1)
  const sparkElement = document.createElement('span')
  const sparkline = new Sparkline(sparkElement)
  cell.appendChild (sparkElement)
  
  var onlyPrices = [];
  midprice[key].forEach(function(item) {
    onlyPrices.push ( item[1] )
  });
  
  sparkline.draw(onlyPrices)
}


//update dom with last changes
function refreshTable () {
  //this is probably not the most optimal procedure, but for simplicity, I'll clear the full table in each refresh
  //since order of all rows can change, and new rows could appear
  removeChildren (dataTable)
  
  //iterate ordered array and create rows using that order
  orderedKeys.forEach(function(key) {
    var currentRow = data[key];
    //add new row to last position
    var row = dataTable.insertRow(-1)
    
    //add cells with currency values
    for (var keyRow in currentRow) {
      //show only enabled fields
      if (currentRow.hasOwnProperty(keyRow)  && showFields.indexOf(keyRow) > -1) {
        var cell = row.insertCell(-1)
        cell.innerHTML = currentRow[keyRow]
      }
    }
    
    addMidpriceSpakline (key, row)
  });
}

//called when connection stablished
function connectCallback() {
  console.info ("It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs.")
  //start reading messages from topic
  var subscription = client.subscribe("/fx/prices", receiveMsg)
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

